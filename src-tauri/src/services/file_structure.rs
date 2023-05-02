use std::fs::{create_dir, read_dir};
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::file::FileData;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FsCommand {
    QueryRoot,
    QueryPath { path: PathBuf },
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum QueryCommandResponse {
    Directory {
        data: FileData,
        entries: Vec<FileData>,
    },
    Path {
        data: FileData,
    },
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

            Ok(QueryCommandResponse::Directory {
                data: FileData::from(path),
                entries,
            })
        } else if path.is_file() {
            Ok(QueryCommandResponse::Path { data: path.into() })
        } else {
            Err(format!(
                "Path {} is not a file or directory",
                path.display()
            ))
        }
    }
}
