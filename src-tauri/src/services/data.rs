use tauri::{Runtime, State, Wry};
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::Serialize;

#[derive(Clone)]
pub struct Data<R: Runtime> {
    pub app_handle: tauri::AppHandle<R>,
}

pub type DataState<'a> = State<'a, ArcData>;

#[derive(Clone)]
pub struct ArcData(pub Arc<Mutex<Data<Wry>>>);

impl ArcData {
    pub fn new(data: Data<Wry>) -> Self {
        Self(Arc::new(Mutex::new(data)))
    }
}

#[derive(Serialize)]
pub struct ExampleStruct {
    pub name: String,
    pub age: u8,
}
