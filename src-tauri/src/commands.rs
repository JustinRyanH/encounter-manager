use crate::services::{data::DataState, file_structure::{QueryCommand, QueryCommandResponse}};



#[tauri::command]
pub async fn query_file_system(
    state: DataState<'_>,
    command: QueryCommand,
) -> Result<QueryCommandResponse, String> {
    let data = state.lock().await;
    let file_query = &data.file_query;
    match command {
        QueryCommand::Root => file_query.query_root(),
        QueryCommand::Path { path } => file_query.query_path(&path),
    }
}