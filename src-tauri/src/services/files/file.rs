use std::path::{Path, PathBuf};

use specta::Type;
use serde::Serialize;

#[derive(Clone, Debug, PartialEq, Serialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum FileType {
    Directory,
    File,
    Unknown,
}

impl From<&PathBuf> for FileType {
    fn from(value: &PathBuf) -> Self {
        if value.is_dir() {
            Self::Directory
        } else if value.is_file() {
            Self::File
        } else {
            Self::Unknown
        }
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct FileData {
    file_type: FileType,
    name: String,
    parent_dir: Option<String>,
    extension: Option<String>,
    path: PathBuf,
}

impl From<&Path> for FileData {
    fn from(value: &Path) -> Self {
        value.to_path_buf().into()
    }
}

impl From<PathBuf> for FileData {
    fn from(value: PathBuf) -> Self {
        Self::from(&value)
    }
}

impl From<&PathBuf> for FileData {
    fn from(value: &PathBuf) -> Self {
        Self {
            file_type: FileType::from(value),
            name: value
                .file_name()
                .map(|s| s.to_string_lossy().to_string())
                .unwrap_or_default(),
            parent_dir: value.parent().map(|s| s.to_string_lossy().to_string()),
            extension: value.extension().map(|s| s.to_string_lossy().to_string()),
            path: value.clone(),
        }
    }
}
