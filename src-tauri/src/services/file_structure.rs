use std::fs::{create_dir, read_dir};
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "command")]
pub enum QueryCommand {
    Root,
    Path { path: PathBuf },
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "response")]
pub enum QueryCommandResponse {
    Root { entries: Vec<FileType> },
    Path { path: FileType },
}

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
pub enum FileType {
    Directory { path: PathBuf, name: Option<String> },
    File { path: PathBuf, name: Option<String> },
    Unknown,
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

    pub fn get_root(&self) -> PathBuf {
        self.root.clone()
    }

    pub fn query_root(&self) -> Result<QueryCommandResponse, String> {
        if !self.root.exists() {
            return Err("Root Directory does not exist".to_string());
        }
        if self.root.is_dir() {
            let entries = read_dir(&self.root)
                .map_err(|e| e.to_string())?
                .map(|entry| {
                    let entry = entry.unwrap();
                    let path = entry.path();
                    if path.is_dir() {
                        FileType::Directory {
                            name: path.file_name().map(|s| s.to_string_lossy().to_string()),
                            path,
                        }
                    } else if path.is_file() {
                        FileType::File {
                            name: path.file_name().map(|s| s.to_string_lossy().to_string()),
                            path,
                        }
                    } else {
                        FileType::Unknown
                    }
                })
                .collect();

            Ok(QueryCommandResponse::Root { entries })
        } else {
            Err("Root is not a directory".to_string())
        }
    }
}
