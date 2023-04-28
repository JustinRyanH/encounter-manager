use std::{path, sync::Arc};

use notify::RecursiveMode;
use serde::Serialize;
use tauri::{async_runtime, Manager, Runtime, State, Wry};
use tokio::sync::{Mutex, MutexGuard};

use crate::services::file_watcher::FileWatcher;

pub struct BackgroundData<R: Runtime> {
    pub app_handle: tauri::AppHandle<R>,
    pub file_watcher: FileWatcher,
}

impl<R: Runtime> BackgroundData<R> {
    pub fn new(app_handle: tauri::AppHandle<R>) -> Result<Self, String> {
        let file_watcher = FileWatcher::new().map_err(String::from)?;
        Ok(Self {
            app_handle,
            file_watcher,
        })
    }
}

pub type DataState<'a> = State<'a, ArcData>;

#[derive(Clone)]
pub struct ArcData(pub Arc<Mutex<BackgroundData<Wry>>>);

impl ArcData {
    pub fn new(data: BackgroundData<Wry>) -> Self {
        Self(Arc::new(Mutex::new(data)))
    }

    pub async fn lock(&self) -> MutexGuard<BackgroundData<Wry>> {
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
        let (app_handle, mut receiver) = {
            let locked_self = self.lock().await;
            (
                locked_self.app_handle.clone(),
                locked_self.file_watcher.sender.subscribe(),
            )
        };
        async_runtime::spawn(async move {
            loop {
                let event = receiver
                    .recv()
                    .await
                    .expect("Something has happend to the connector");
                app_handle
                    .emit_all("file_system:update", event)
                    .expect("failed to emit");
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
                let data = self.0.lock().await;
                data.app_handle
                    .emit_all(
                        "test",
                        &ExampleStruct {
                            name: "test".to_string(),
                            age: 42,
                        },
                    )
                    .expect("failed to emit");
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

#[derive(Serialize)]
pub struct ExampleStruct {
    pub name: String,
    pub age: u8,
}

pub fn start(app_handle: tauri::AppHandle<Wry>) -> Result<ArcData, String> {
    let data_out = ArcData::new(BackgroundData::new(app_handle)?);
    data_out.clone().start_main_loop()?;
    Ok(data_out)
}
