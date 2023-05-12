// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate core;

mod commands;
mod encounters;
mod services;

use tauri::{generate_context, Manager};

use crate::{
    commands::{encounter, query_file_system, update_encounter_character},
    services::file_system_connection,
};
use crate::encounters::encounter::EncounterManager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let lotr = load_of_rings_mock();
            let hp = harry_potter_mock();
            let mut encounter_collection = encounters::EncounterCollection::new();
            encounter_collection.add_encounter(lotr);
            encounter_collection.add_encounter(hp);

            let arc_data = file_system_connection::start(app.handle())?;
            app.manage(arc_data);
            app.manage(EncounterManager::from(encounter_collection));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![query_file_system, encounter, update_encounter_character])
        .run(generate_context!())
        .expect("error while running tauri application");
}

fn load_of_rings_mock() -> encounters::Encounter {
    let frodo = encounters::Character::new("Frodo", 8, 18);
    let sam = encounters::Character::new("Sam", 6, 19);
    let pippin = encounters::Character::new("Pippin", 4, 5);
    let merry = encounters::Character::new("Merry", 7, 3);
    let mut encounter = encounters::Encounter::new("Lord of the Rings");
    encounter.add_character(frodo);
    encounter.add_character(sam);
    encounter.add_character(pippin);
    encounter.add_character(merry);
    encounter
}

fn harry_potter_mock() -> encounters::Encounter {
    let harry = encounters::Character::new("Harry", 4, 18);
    let ron = encounters::Character::new("Ron", 6, 3);
    let hermione = encounters::Character::new("Hermione", 4, 14);
    let mut encounter = encounters::Encounter::new("Harry Potter");
    encounter.add_character(harry);
    encounter.add_character(ron);
    encounter.add_character(hermione);
    encounter
}
