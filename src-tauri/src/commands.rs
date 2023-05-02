use crate::services::{
    data::DataState,
    file_structure::{FsCommand, QueryCommandResponse},
};

#[tauri::command]
pub async fn query_file_system(
    state: DataState<'_>,
    command: FsCommand,
) -> Result<QueryCommandResponse, String> {
    let data = state.lock().await;
    let file_query = &data.file_query;
    match command {
        FsCommand::Root => file_query.query_root(),
        FsCommand::Path { path } => file_query.query_path(&path),
    }
}
