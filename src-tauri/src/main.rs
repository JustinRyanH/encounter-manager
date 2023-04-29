// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate core;

mod services;

use services::file_structure::{QueryCommand, QueryCommandResponse};
use tauri::{generate_context, Manager};

use crate::services::data;
use crate::services::data::DataState;

#[tauri::command]
async fn query_file_system(
    state: DataState<'_>,
    command: QueryCommand,
) -> Result<QueryCommandResponse, String> {
    let data = state.lock().await;
    let file_query = &data.file_query;
    match command {
        QueryCommand::Root => file_query.query_root(),
        _ => unimplemented!("Command not implemented"),
    }
}

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
