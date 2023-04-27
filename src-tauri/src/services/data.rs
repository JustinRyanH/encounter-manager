use std::sync::Arc;

use serde::Serialize;
use notify::{Watcher, RecursiveMode, RecommendedWatcher};
use tauri::{async_runtime, Manager, Runtime, State, Wry};
use tokio::sync::Mutex;

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
        let mut watcher = notify::recommended_watcher(move |res| {
            match res {
                Ok(event) => {
                    println!("event: {:?}", event);
                }
                Err(e) => println!("watch error: {:?}", e),
            };
        }).map_err(|e| e.to_string())?;

        async_runtime::spawn(async move {
            let watch_path = {
                let mut path = tauri::api::path::document_dir().expect("Could not find Document Directory");
                path.push("Encounter Manager");
                if !path.clone().exists() {
                    std::fs::create_dir(path.clone()).expect("Could not create directory");
                }
                path
            };

            watcher.watch(watch_path.as_path(), RecursiveMode::Recursive).expect("Could not watch directory");
            loop {
                let data = self.0.lock().await;
                data.app_handle.emit_all("test",
                              &ExampleStruct {
                                  name: "test".to_string(),
                                  age: 42,
                              },
                ).expect("failed to emit");
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
        });
        Ok(())
    }
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
    data_out.clone().start_main_loop();
    Ok(data_out)
}