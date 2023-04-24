// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::path::document_dir;

const ENCOUNTER_MANAGER_DIRECTORY: &'static str = "Encounter Manager";

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn browse_document_files() -> Result<Vec<String>, String> {
    let mut path = document_dir().ok_or("Could not find Document Directory")?;
    path.push(ENCOUNTER_MANAGER_DIRECTORY);
    if (!path.clone().exists()) {
        return Err("Could not find Encounter Manager Directory".to_string());
    }
    Ok(["Test File Name".to_string()].to_vec())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, browse_document_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
