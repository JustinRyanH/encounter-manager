use std::path::PathBuf;

use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileData {
    name: Option<String>,
    parent_dir: Option<String>,
    path: PathBuf,
}

impl FileData {
    pub fn new(path: PathBuf) -> Self {
        Self {
            name: path.file_name().map(|s| s.to_string_lossy().to_string()),
            parent_dir: path.parent().map(|s| s.to_string_lossy().to_string()),
            path,
        }
    }
}
