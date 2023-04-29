use std::ffi::OsStr;
use std::fs::{create_dir, read_dir, File};
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::file::FileData;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "command")]
#[serde(rename_all = "camelCase")]
pub enum QueryCommand {
    Root,
    Path { path: PathBuf },
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
#[serde(rename_all = "camelCase")]
pub enum QueryCommandResponse {
    Directory { entries: Vec<FileType> },
    Path(FileData),
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
#[serde(rename_all = "camelCase")]
pub enum FileType {
    Directory(FileData),
    File(FileData),
    Unknown,
}

impl From<PathBuf> for FileType {
    fn from(value: PathBuf) -> Self {
        if value.is_dir() {
            Self::Directory(FileData::new(value))
        } else if value.is_file() {
            Self::File(FileData::new(value))
        } else {
            Self::Unknown
        }
    }
}

#[derive(Clone, Debug)]
pub struct FileQuery {
    root: PathBuf,
}

impl FileQuery {
    pub fn new(root: &Path) -> Result<Self, String> {
        if !root.exists() {
            create_dir(&root).map_err(|e| e.to_string())?;
        }
        if !root.is_dir() {
            return Err(format!("{} is not a directory", root.display()));
        }
        Ok(Self {
            root: root.to_path_buf(),
        })
    }

    pub fn query_root(&self) -> Result<QueryCommandResponse, String> {
        if !self.root.exists() {
            return Err("Root Directory does not exist".to_string());
        }
        return self.query_path(&self.root);
    }

    pub fn query_path(&self, path: &Path) -> Result<QueryCommandResponse, String> {
        let path = self.root.join(path);
        if !path.exists() {
            return Err(format!("Path {} does not exist", path.display()));
        }
        if path.is_dir() {
            let entries = read_dir(&path)
                .map_err(|e| e.to_string())?
                .map(|entry| {
                    let entry = entry.unwrap();
                    let path = entry.path();
                    path.into()
                })
                .collect();

            Ok(QueryCommandResponse::Directory { entries })
        } else if path.is_file() {
            Ok(QueryCommandResponse::Path(FileData::new(path)))
        } else {
            Err(format!(
                "Path {} is not a file or directory",
                path.display()
            ))
        }
    }
}
