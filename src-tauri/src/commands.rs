use crate::services::{
    data::DataState,
    file_structure::{FsCommand, QueryCommandResponse},
};
use crate::services::file_structure::TouchFileCommand;

#[tauri::command]
pub async fn query_file_system(
    state: DataState<'_>,
    command: FsCommand,
) -> Result<QueryCommandResponse, String> {
    let data = state.lock().await;
    let file_query = &data.file_query;
    match command {
        FsCommand::QueryRoot => file_query.query_root(),
        FsCommand::QueryPath { path } => file_query.query_path(&path),
        FsCommand::TouchFile(TouchFileCommand { parent_dir, file_name }) => {
            file_query.touch_file(&parent_dir, &file_name)
        }
    }
}
