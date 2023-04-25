// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::Serialize;
use tauri::api::path::document_dir;
use tauri::{generate_context, Manager, Runtime, State, Wry};

const ENCOUNTER_MANAGER_DIRECTORY: &str = "Encounter Manager";

pub struct Data<R: Runtime> {
    pub app_handle: tauri::AppHandle<R>,
}

pub type DataState<'a, R> = State<'a, ArcData<R>>;
pub struct ArcData<R: Runtime>(pub Arc<Mutex<Data<R>>>);
impl<R: Runtime> ArcData<R> {
    pub fn new(data: Data<R>) -> Self {
        Self(Arc::new(Mutex::new(data)))
    }
}

#[derive(Serialize)]
struct ExampleStruct {
    pub name: String,
    pub age: u8,
}

#[tauri::command]
async fn test_data(state: DataState<'_, Wry>) -> Result<(), String> {
    let data = state.0.lock().await;
    let app_handle = data.app_handle.clone();
    app_handle
        .emit_all("test", &ExampleStruct {
            name: "test".to_string(),
            age: 42,
        })
        .expect("failed to emit");
    Ok(())
}

#[tauri::command]
fn browse_document_files() -> Result<Vec<String>, String> {
    let mut path = document_dir().ok_or("Could not find Document Directory")?;
    path.push(ENCOUNTER_MANAGER_DIRECTORY);
    if !path.clone().exists() {
        fs::create_dir(path.clone()).map_err(|e| e.to_string())?;
    }
    let entries = fs::read_dir(path.clone()).map_err(|e| e.to_string())?;
    let file_names = entries.filter_map(|e| match e {
        Ok(entry) => {
            let path = entry.path();
            if path.is_file() {
                Some(entry.file_name())
            } else {
                None
            }
        }
        Err(_) => None,
    });

    let out: Vec<String> = file_names.filter_map(|path| path.into_string().ok()).collect();
    Ok(out)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let data = Data { app_handle: app_handle.clone() };
            let arc_data = ArcData::new(data);
            app.manage(arc_data);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![test_data, browse_document_files])
        .run(generate_context!())
        .expect("error while running tauri application");
}
