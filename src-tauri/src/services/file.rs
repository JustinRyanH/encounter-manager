use std::path::{Path, PathBuf};

use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileData {
    name: Option<String>,
    parent_dir: Option<String>,
    path: PathBuf,
}

impl From<&Path> for FileData {
    fn from(value: &Path) -> Self {
        value.to_path_buf().into()
    }
}

impl From<PathBuf> for FileData {
    fn from(value: PathBuf) -> Self {
        Self {
            name: value.file_name().map(|s| s.to_string_lossy().to_string()),
            parent_dir: value.parent().map(|s| s.to_string_lossy().to_string()),
            path: value,
        }
    }
}
