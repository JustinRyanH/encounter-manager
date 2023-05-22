use uuid::Uuid;
use crate::encounters::character::{CharacterCommand, CharacterCommandResponse};
use crate::encounters::encounter::EncounterManagerState;
use crate::services::{
    file_system_connection::FileSystemState,
    files::file_structure::{FsCommand, QueryCommandResponse},
};
use crate::services::files::file_structure::TouchCommand;
use crate::encounters::commands::{EncounterCommandResponse, EncounterCommands};

#[tauri::command]
#[specta::specta]
pub async fn encounter(state: EncounterManagerState<'_>, command: EncounterCommands) -> Result<EncounterCommandResponse, String> {
    let encounter = state.lock().await;
    match command {
        EncounterCommands::ListEncounter => EncounterCommandResponse::list_from_collection(&encounter),
        EncounterCommands::UpdateStage(_) => todo!("Update stage")
    }
}

#[tauri::command]
#[specta::specta]
pub async fn update_encounter_character(state: EncounterManagerState<'_>, encounter_id: Uuid, command: CharacterCommand) -> Result<CharacterCommandResponse, String> {
    let mut manager = state.lock().await;
    let encounter = manager.find_encounter_mut(encounter_id).ok_or("Encounter not found")?;
    encounter.update_character(command)
}

#[tauri::command]
#[specta::specta]
pub async fn query_file_system(
    state: FileSystemState<'_>,
    command: FsCommand,
) -> Result<Option<QueryCommandResponse>, String> {
    let data = state.lock().await;
    let file_query = &data.file_query;
    match command {
        FsCommand::QueryRoot => file_query.query_root().map(Some),
        FsCommand::QueryPath { path } => file_query.query_path(&path).map(Some),
        FsCommand::TouchFile(TouchCommand { parent_dir, name: file_name }) => {
            file_query.touch_file(&parent_dir, &file_name).map(Some)
        }
        FsCommand::TouchDirectory(TouchCommand { parent_dir, name: dir_name }) => {
            file_query.touch_directory(&parent_dir, &dir_name).map(Some)
        }
        FsCommand::DeletePath { path } => file_query.delete_path(&path).map(|_| None),
        FsCommand::RenamePath { from, to } => file_query.rename_path(&from, &to).map(|_| None),
    }
}
