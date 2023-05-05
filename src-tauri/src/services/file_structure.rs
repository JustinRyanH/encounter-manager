use std::fs;
use std::fs::{create_dir, read_dir};
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::file::FileData;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TouchFileCommand {
    pub parent_dir: PathBuf,
    pub file_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FsCommand {
    QueryRoot,
    QueryPath { path: PathBuf },
    TouchFile(TouchFileCommand),
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum QueryCommandResponse {
    Directory {
        data: FileData,
        entries: Vec<FileData>,
    },
    File {
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
        self.query_path(&self.root)
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
            Ok(QueryCommandResponse::File { data: path.into() })
        } else {
            Err(format!(
                "Path {} is not a file or directory",
                path.display()
            ))
        }
    }

    pub fn touch_file(&self, directory: &Path, file_name: &str) -> Result<QueryCommandResponse, String> {
        if !directory.exists() {
            return Err(format!("Directory {} does not exist", directory.display()));
        }
        if !directory.is_dir() {
            return Err(format!("Path {} is not a directory", directory.display()));
        }
        let directory = match directory.has_root() {
            true => directory.to_path_buf(),
            false => self.root.join(directory),
        };
        if !directory.starts_with(&self.root) {
            return Err(format!("Path {} is not a subdirectory of {}", directory.display(), self.root.display()));
        }
        let path = directory.join(file_name);
        if path.exists() {
            return Ok(QueryCommandResponse::File { data: path.into() });
        }
        fs::File::create(&path).map_err(|e| e.to_string())?;
        return Ok(QueryCommandResponse::File { data: path.into() });
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempdir;

    #[test]
    fn test_query_root_no_directory() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let bad_root = tmp_dir.path().join("bad_path");
        assert!(!bad_root.exists(), "bad_root should not exist before new query file in test");
        let result = FileQuery::new(&bad_root);
        assert!(result.is_ok(), "FileQuery can handle non-existent path");
        assert!(bad_root.exists(), "FileQuery::new creates a new directory");
    }

    #[test]
    fn test_query_root_is_file() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let bad_path = tmp_dir.path().join("file");
        let file = fs::File::create(&bad_path).unwrap();
        assert!(file.metadata().unwrap().is_file(), "bad_path should be a file before new query file in test");
        let result = FileQuery::new(&bad_path);
        assert!(result.is_err(), "if we set it to file we should error");
        assert_eq!(result.err(), Some(format!("{} is not a directory", bad_path.display())));
    }
}