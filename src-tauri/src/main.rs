// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::api::path::document_dir;

const ENCOUNTER_MANAGER_DIRECTORY: &str = "Encounter Manager";

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
        .invoke_handler(tauri::generate_handler![browse_document_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
