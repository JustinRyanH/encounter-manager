use std::cmp::Ordering;
use std::path::{Path, PathBuf};

use specta::Type;
use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub enum FileType {
    Directory,
    File,
    Unknown,
}

impl PartialOrd for FileType {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for FileType {
    fn cmp(&self, other: &Self) -> Ordering {
        match (self, other) {
            (Self::Directory, Self::Directory) => Ordering::Equal,
            (Self::Directory, Self::File) => Ordering::Less,
            (Self::Directory, Self::Unknown) => Ordering::Less,
            (Self::File, Self::Directory) => Ordering::Greater,
            (Self::File, Self::File) => Ordering::Equal,
            (Self::File, Self::Unknown) => Ordering::Less,
            (Self::Unknown, Self::Directory) => Ordering::Greater,
            (Self::Unknown, Self::File) => Ordering::Greater,
            (Self::Unknown, Self::Unknown) => Ordering::Equal,
        }
    }
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

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct FileData {
    pub file_type: FileType,
    pub name: String,
    pub parent_dir: Option<String>,
    pub extension: Option<String>,
    pub path: PathBuf,
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
