use std::{path::Path, sync::Arc};

use notify::{RecursiveMode, Watcher};
use serde::Serialize;
use tauri::{async_runtime, Manager, Runtime, State, Wry};
use tokio::sync::{broadcast, Mutex};

#[derive(Clone, Debug, Copy, Serialize)]
pub enum FileChangEvent {
    Create,
    Delete,
    Modify,
    Rename,
    Unknown,
}

struct FileWatcher {
    pub watcher: notify::RecommendedWatcher,
    pub sender: broadcast::Sender<FileChangEvent>,
}

impl FileWatcher {
    pub fn new() -> Result<(Self, broadcast::Receiver<FileChangEvent>), String> {
        let (sender, receiver) = broadcast::channel(1);
        let watcher = notify::recommended_watcher(|res| {
            match res {
                Ok(event) => {
                    println!("event: {:?}", event);
                }
                Err(e) => println!("watch error: {:?}", e),
            };
        })
        .map_err(|e| e.to_string())?;
        Ok((Self { watcher, sender }, receiver))
    }

    pub fn watch(&mut self, path: &Path) -> Result<(), String> {
        self.watcher
            .watch(path, RecursiveMode::Recursive)
            .map_err(|e| e.to_string())
    }
}

#[derive(Clone)]
pub struct BackgroundData<R: Runtime> {
    pub app_handle: tauri::AppHandle<R>,
}

pub type DataState<'a> = State<'a, ArcData>;

#[derive(Clone)]
pub struct ArcData(pub Arc<Mutex<BackgroundData<Wry>>>);

impl ArcData {
    pub fn new(data: BackgroundData<Wry>) -> Self {
        Self(Arc::new(Mutex::new(data)))
    }

    pub fn start_main_loop(self) -> Result<(), String> {
        let (mut file_watcher, receiver) = FileWatcher::new()?;

        async_runtime::spawn(async move {
            let watch_path = get_or_create_doc_path("Encounter Manager");

            file_watcher
                .watch(watch_path.as_path())
                .expect("Could not watch directory");

            async_runtime::spawn(async move {
                let mut receiver = file_watcher
                    .sender
                    .subscribe()
                    .expect("Could not subscribe to file watcher");

                loop {
                    let event = receiver.recv().await.expect("Could not receive event");
                    println!("Received event: {:?}", event);
                }
            })

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
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
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
    let data_out = ArcData::new(BackgroundData {
        app_handle: app_handle.clone(),
    });
    data_out.clone().start_main_loop()?;
    Ok(data_out)
}
