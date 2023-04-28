use std::{sync::Arc};

use serde::Serialize;
use tauri::{async_runtime, Manager, Runtime, State, Wry};
use tokio::sync::{Mutex};

use crate::services::file_watcher::FileWatcher;

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
        let mut file_watcher= FileWatcher::new()?;

        async_runtime::spawn(async move {
            let watch_path = get_or_create_doc_path("Encounter Manager");

            file_watcher
                .watch(watch_path.as_path())
                .expect("Could not watch directory");

            async_runtime::spawn(async move {
                loop {
                    let event = file_watcher.receiver.recv().await.expect("Could not receive event");
                    println!("event: {:?}", event);
                }
            });

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
    let data_out = ArcData::new(BackgroundData { app_handle });
    data_out.clone().start_main_loop()?;
    Ok(data_out)
}
