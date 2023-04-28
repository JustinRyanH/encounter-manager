use std::fs::read_dir;
use std::path::{Path, PathBuf};

use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
#[serde(tag = "type")]
pub enum FileType {
    Directory { name: PathBuf },
    File { name: PathBuf },
    Unknown,
}

#[derive(Clone, Debug)]
pub struct FileQuery {
    root: PathBuf,
}

impl FileQuery {
    pub fn new(root: &Path) -> Result<Self, String> {
        Ok(Self {
            root: root.to_path_buf(),
        })
    }

    pub async fn query_root(&self) -> Result<Vec<FileType>, String> {
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
                        FileType::Directory { name: path }
                    } else if path.is_file() {
                        FileType::File { name: path }
                    } else {
                        FileType::Unknown
                    }
                })
                .collect();

            Ok(entries)
        } else {
            Err("Root is not a directory".to_string())
        }
    }
}
