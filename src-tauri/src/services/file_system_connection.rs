use std::{path, sync::Arc};

use notify::RecursiveMode;
use tauri::{api::path::document_dir, async_runtime, Manager, Runtime, State, Wry};
use tokio::sync::{Mutex, MutexGuard};

use crate::services::file_watcher::FileWatcher;

use super::{file::FileData, file_structure::RootDirectory, file_watcher::FileChangeEvent};

pub struct FileSystemConnection<R: Runtime> {
    pub app_handle: tauri::AppHandle<R>,
    pub file_watcher: FileWatcher,
    pub file_query: RootDirectory,
}

impl<R: Runtime> FileSystemConnection<R> {
    pub fn new(app_handle: tauri::AppHandle<R>) -> Result<Self, String> {
        let file_watcher = FileWatcher::new().map_err(String::from)?;
        let mut document_path = document_dir().ok_or("Failed to get document Path")?;
        document_path.push("Encounter Manager");

        let file_query = RootDirectory::new(document_path.as_path())?;
        Ok(Self {
            app_handle,
            file_watcher,
            file_query,
        })
    }
}

pub type DataState<'a> = State<'a, ArcData>;

#[derive(Clone)]
pub struct ArcData(pub Arc<Mutex<FileSystemConnection<Wry>>>);

impl ArcData {
    pub fn new(data: FileSystemConnection<Wry>) -> Self {
        Self(Arc::new(Mutex::new(data)))
    }

    pub async fn lock(&self) -> MutexGuard<FileSystemConnection<Wry>> {
        self.0.lock().await
    }

    pub async fn watch_path(
        &mut self,
        path: &path::Path,
        mode: RecursiveMode,
    ) -> Result<(), String> {
        self.lock().await.file_watcher.watch(path, mode)
    }

    pub async fn push_file_changes_to_frontend(&mut self) {
        let cloned_self = self.clone();
        async_runtime::spawn(async move {
            let mut receiver = { (cloned_self.lock().await).file_watcher.sender.subscribe() };

            let mut last_event: Option<FileChangeEvent> = None;
            loop {
                let event = match receiver
                    .recv()
                    .await
                    .expect("Something has happend to the connector")
                {
                    FileChangeEvent::Create(file_data) => Some(FileChangeEvent::Create(file_data)),
                    FileChangeEvent::Delete(file_data) => Some(FileChangeEvent::Delete(file_data)),
                    FileChangeEvent::Modify(file_data) => Some(FileChangeEvent::Modify(file_data)),
                    FileChangeEvent::RenameAny { path } => {
                        if let Some(FileChangeEvent::RenameAny { path: from }) = last_event {
                            last_event = None;
                            Some(FileChangeEvent::Rename {
                                from: from.clone(),
                                to: path.clone(),
                                data: FileData::from(path),
                            })
                        } else {
                            last_event = Some(FileChangeEvent::RenameAny { path });
                            None
                        }
                    }
                    FileChangeEvent::Rename { from, to, data } => {
                        Some(FileChangeEvent::Rename { from, to, data })
                    }
                    FileChangeEvent::Ignore => {
                        last_event = None;
                        None
                    }
                };

                if let Some(event) = event {
                    let app_handle = cloned_self.lock().await.app_handle.clone();
                    app_handle
                        .emit_all("file_system:update", event)
                        .expect("failed to emit");
                }
            }
        });
    }

    pub fn start_main_loop(mut self) -> Result<(), String> {
        let watch_path = get_or_create_doc_path("Encounter Manager");

        async_runtime::spawn(async move {
            self.watch_path(&watch_path, RecursiveMode::Recursive)
                .await
                .expect("failed to watch");
            self.push_file_changes_to_frontend().await;

            loop {
                tokio::time::sleep(std::time::Duration::from_secs(10)).await;
            }
        });
        Ok(())
    }
}

fn get_or_create_doc_path(directory: &str) -> std::path::PathBuf {
    let mut path = tauri::api::path::document_dir().expect("Could not find Document Directory");
    path.push(directory);
    if !path.clone().exists() {
        std::fs::create_dir(path.clone()).expect("Could not create directory");
    }
    path
}

pub fn start(app_handle: tauri::AppHandle<Wry>) -> Result<ArcData, String> {
    let data_out = ArcData::new(FileSystemConnection::new(app_handle)?);
    data_out.clone().start_main_loop()?;
    Ok(data_out)
}
