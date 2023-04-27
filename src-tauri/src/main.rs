// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod services;

use std::fs;
use std::time::Duration;
use tauri::api::path::document_dir;
use tauri::{async_runtime, generate_context, Manager};

use services::data::{ArcData, Data, DataState, ExampleStruct};

const ENCOUNTER_MANAGER_DIRECTORY: &str = "Encounter Manager";

#[tauri::command]
async fn test_data(state: DataState<'_>) -> Result<(), String> {
    let data = state.0.lock().await;
    let app_handle = data.app_handle.clone();
    app_handle
        .emit_all(
            "test",
            &ExampleStruct {
                name: "test".to_string(),
                age: 42,
            },
        )
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

    let out: Vec<String> = file_names
        .filter_map(|path| path.into_string().ok())
        .collect();
    Ok(out)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle();
            let data = Data { app_handle };
            let arc_data = ArcData::new(data);

            let arc_data_copy = arc_data.clone();
            async_runtime::spawn(async move {
                let local = arc_data_copy;
                loop {
                    let data = local.0.lock().await;
                    data.app_handle
                        .emit_all(
                            "test",
                            &ExampleStruct {
                                name: "test".to_string(),
                                age: 42,
                            },
                        )
                        .expect("failed to emit");
                    tokio::time::sleep(Duration::from_secs(5)).await;
                }
            });
            app.manage(arc_data);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![test_data, browse_document_files])
        .run(generate_context!())
        .expect("error while running tauri application");
}
