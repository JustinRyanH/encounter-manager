// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate core;

mod commands;
mod services;
mod encounters;

use tauri::{generate_context, Manager};

use crate::{commands::{query_file_system, encounter}, services::file_system_connection};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let frodo = encounters::Character::new("Frodo", 8, 18);
            let sam = encounters::Character::new("Sam", 6, 19);
            let pippin = encounters::Character::new("Pippin", 4, 5);
            let merry = encounters::Character::new("Merry", 7, 3);
            let mut encounter = encounters::Encounter::new("Lord of the Rings");
            encounter.add_character(frodo);
            encounter.add_character(sam);
            encounter.add_character(pippin);
            encounter.add_character(merry);

            let arc_data = file_system_connection::start(app.handle())?;
            app.manage(arc_data);
            app.manage(encounter);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![query_file_system, encounter])
        .run(generate_context!())
        .expect("error while running tauri application");
}
