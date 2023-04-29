// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate core;

mod commands;
mod services;

use tauri::{generate_context, Manager};

use crate::{commands::query_file_system, services::data};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let arc_data = data::start(app.handle())?;
            app.manage(arc_data);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![query_file_system])
        .run(generate_context!())
        .expect("error while running tauri application");
}
