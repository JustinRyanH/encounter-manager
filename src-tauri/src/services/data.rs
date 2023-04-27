use tauri::{async_runtime, Manager, Runtime, State, Wry};
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::Serialize;


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
}

#[derive(Serialize)]
pub struct ExampleStruct {
    pub name: String,
    pub age: u8,
}

pub fn start(data: &ArcData) -> Result<(), String> {
    let data = data.clone();
    async_runtime::spawn(async move {
        loop {
            let data = data.0.lock().await;
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