use std::fs;
use std::fs::{create_dir, create_dir_all, read_dir};
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use super::file::FileData;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TouchCommand {
    pub parent_dir: PathBuf,
    pub name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum FsCommand {
    QueryRoot,
    QueryPath { path: PathBuf },
    TouchFile(TouchCommand),
    TouchDirectory(TouchCommand),
    DeletePath { path: PathBuf },
    RenamePath { from: PathBuf, to: String },
}

#[derive(Clone, Debug, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum QueryCommandResponse {
    Directory {
        data: FileData,
        entries: Vec<FileData>,
    },
    File {
        data: FileData,
    },
    None,
}

#[derive(Clone, Debug)]
pub struct RootDirectory {
    root: PathBuf,
}

impl RootDirectory {
    pub fn new(root: &Path) -> Result<Self, String> {
        if !root.exists() {
            create_dir(root).map_err(|e| e.to_string())?;
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
            Self::build_directory_from_path(&path)
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
        let directory = self.path_from_root(directory);
        self.validate_directory(&directory)?;

        let path = directory.join(file_name);
        if path.exists() {
            return Self::build_file_from_path(&path);
        }
        fs::File::create(&path).map_err(|e| e.to_string())?;
        Self::build_file_from_path(&path)
    }

    pub fn touch_directory(&self, directory: &Path, dir_name: &str) -> Result<QueryCommandResponse, String> {
        let directory = self.path_from_root(directory);
        self.validate_directory(&directory)?;

        let path = directory.join(dir_name);
        if path.exists() {
            return Self::build_directory_from_path(&path);
        }

        create_dir_all(&path).map_err(|e| e.to_string())?;
        Self::build_directory_from_path(&path)
    }

    pub fn delete_path(&self, path: &Path) -> Result<() , String> {
        self.validate_in_root(path)?;
        if !path.exists() {
            return Err(format!("Path {} does not exist", path.display()));
        }
        if path.is_dir() {
            fs::remove_dir_all(path).map_err(|e| e.to_string())?;
        } else if path.is_file() {
            fs:: remove_file(path).map_err(|e| e.to_string())?;
        } else {
            return Err(format!("Path {} is not a file or directory", path.display()));
        }
        Ok(())
    }

    pub fn rename_path(&self, from: &Path, to: &str) -> Result<(), String> {
        let from = self.path_from_root(from);
        let to = from.parent()
            .ok_or(format!("Parent does not exist for {}", from.display()))?
            .join(to);

        self.validate_in_root(&from)?;
        self.validate_in_root(&to)?;

        if !from.exists() {
            return Err(format!("Path {} does not exist", from.display()));
        }

        if to.exists() {
            return Err(format!("Path {} already exists", to.display()));
        }

        fs::rename(&from, &to).map_err(|e| e.to_string())?;

        Ok(())
    }

    fn validate_directory(&self, directory: &Path) -> Result<(), String> {
        self.validate_in_root(directory)?;
        if !directory.exists() {
            create_dir_all(directory).map_err(|e| e.to_string())?;
        }
        if !directory.is_dir() {
            return Err(format!("Path {} is not a directory", directory.display()));
        }

        Ok(())
    }

    fn validate_in_root(&self, directory: &Path) -> Result<(), String> {
        if !directory.starts_with(&self.root) {
            return Err(format!("Path {} is not a child of {}", directory.display(), self.root.display()));
        }
        Ok(())
    }

    fn path_from_root(&self, directory: &Path) -> PathBuf {
        match directory.has_root() {
            true => directory.to_path_buf(),
            false => self.root.join(directory),
        }
    }

    fn build_file_from_path(path: &PathBuf) -> Result<QueryCommandResponse, String> {
        if !path.is_file() {
            return Err(format!("{} is not a file", path.display()));
        }
        Ok(QueryCommandResponse::File { data: path.into() })
    }

    fn build_directory_from_path(path: &Path) -> Result<QueryCommandResponse, String> {
        let entries = read_dir(path)
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
    }
}

#[cfg(test)]
mod tests {
    use std::fs::File;
    use super::*;
    use tempdir;

    #[test]
    fn test_query_new_no_directory() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let bad_root = tmp_dir.path().join("bad_path");
        assert!(!bad_root.exists(), "bad_root should not exist before new query file in test");
        let result = RootDirectory::new(&bad_root);
        assert!(result.is_ok(), "FileQuery can handle non-existent path");
        assert!(bad_root.exists(), "FileQuery::new creates a new directory");
    }

    #[test]
    fn test_query_new_is_file() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let bad_path = tmp_dir.path().join("file");
        let file = File::create(&bad_path).unwrap();
        assert!(file.metadata().unwrap().is_file(), "bad_path should be a file before new query file in test");
        let result = RootDirectory::new(&bad_path);
        assert!(result.is_err(), "if we set it to file we should error");
        assert_eq!(result.err(), Some(format!("{} is not a directory", bad_path.display())));
    }

    #[test]
    fn test_query_root_function() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();

        File::create(root_path.join("fileA")).unwrap();
        File::create(root_path.join("fileB")).unwrap();
        create_dir(root_path.join("dirA")).unwrap();

        let result = file_query.query_root();
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), QueryCommandResponse::Directory {
            data: FileData::from(root_path.clone()),
            entries: vec![
                FileData::from(root_path.join("dirA")),
                FileData::from(root_path.join("fileA")),
                FileData::from(root_path.join("fileB")),
            ],
        });
    }

    #[test]
    fn test_query_root_when_deleted() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();

        File::create(root_path.join("fileA")).unwrap();
        File::create(root_path.join("fileB")).unwrap();
        create_dir(root_path.join("dirA")).unwrap();

        let result = file_query.query_root();
        assert!(result.is_ok());
        fs::remove_dir_all(&root_path).unwrap();

        let result = file_query.query_root();
        assert!(result.is_err());
        assert_eq!(result.err(), Some("Root Directory does not exist".to_string()));
    }

    #[test]
    fn test_query_path() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();

        File::create(root_path.join("fileA")).unwrap();
        create_dir(root_path.join("dirA")).unwrap();

        // Will Return a file if it exists
        let result = file_query.query_path(Path::new("fileA"));
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), QueryCommandResponse::File {
            data: FileData::from(root_path.join("fileA")),
        });

        // Return a directory and it's entries if it exists
        let result = file_query.query_path(Path::new("dirA"));
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), QueryCommandResponse::Directory {
            data: FileData::from(root_path.join("dirA")),
            entries: vec![],
        });

        let missing_path = root_path.join("fileB");
        // Will error if path does not exist
        let result = file_query.query_path(&missing_path);
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} does not exist", missing_path.display())));
    }

    #[test]
    fn test_touch_file() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();
        // Will create file if it doesn't exist
        let result = file_query.touch_file(&root_path, "fileA").unwrap();
        assert_eq!(result, QueryCommandResponse::File {
            data: FileData::from(root_path.join("fileA")),
        });

        // Will error if path is not a directory
        let result = file_query.touch_file(&root_path.join("fileA"), "fileB");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a directory", root_path.join("fileA").display())));

        let uncreated_dir = root_path.join("dirA");
        // Will create directory if it doesn't exist
        file_query.touch_file(&uncreated_dir, "fileB").unwrap();
        assert!(uncreated_dir.exists());

        let out_of_root = tmp_dir.path().join("out_of_root");
        // Will error if a child of root
        let result = file_query.touch_file(&out_of_root, "fileB");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a child of {}", out_of_root.display(), root_path.display())));

        assert!(root_path.join("fileA").exists());
        // Will no-op and return existing file
        let result = file_query.touch_file(&root_path, "fileA").unwrap();
        assert_eq!(result, QueryCommandResponse::File {
            data: FileData::from(root_path.join("fileA")),
        });

        // Will place in root if not a has root inclusive pah
        file_query.touch_file(Path::new("example"), "fileA").unwrap();
        assert!(root_path.join("example").exists());
        assert!(root_path.join("example").join("fileA").exists());
    }


    #[test]
    fn test_touch_dir() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();
        // Will create dir if it doesn't exist
        let result = file_query.touch_directory(&root_path, "newDirA").unwrap();
        assert_eq!(result, QueryCommandResponse::Directory {
            data: FileData::from(root_path.join("newDirA")),
            entries: vec![],
        });

        let file = root_path.join("fileA");
        fs::File::create(&file).unwrap();

        // Will error if path is not a directory
        let result = file_query.touch_directory(&root_path.join("fileA"), "newDirB");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a directory", root_path.join("fileA").display())));

        let uncreated_dir = root_path.join("dirA");
        // Will create directory if it doesn't exist
        file_query.touch_directory(&uncreated_dir, "newDirB").unwrap();
        assert!(uncreated_dir.exists());

        let out_of_root = tmp_dir.path().join("out_of_root");
        // Will error if a child of root
        let result = file_query.touch_directory(&out_of_root, "newDirB");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a child of {}", out_of_root.display(), root_path.display())));

        assert!(root_path.join("newDirA").exists());
        // Will no-op and return existing file
        let result = file_query.touch_directory(&root_path, "newDirA").unwrap();
        assert_eq!(result, QueryCommandResponse::Directory {
            data: FileData::from(root_path.join("newDirA")),
            entries: vec![],
        });

        // Will place in root if not a has root inclusive pah
        file_query.touch_directory(Path::new("example"), "newDirA").unwrap();
        assert!(root_path.join("example").exists());
        assert!(root_path.join("example").join("newDirA").exists());
    }

    #[test]
    fn delete_path() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();

        File::create(root_path.join("fileA")).unwrap();
        create_dir(root_path.join("dirA")).unwrap();

        let out_of_root = tmp_dir.path().join("out_of_root");
        // Will error if a child of root
        let result = file_query.delete_path(&out_of_root.join("fileA"));
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a child of {}", out_of_root.join("fileA").display(), root_path.display())));

        // Will error if path does not exist
        let result = file_query.delete_path(&root_path.join("fileB"));
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} does not exist", root_path.join("fileB").display())));

        // Will delete file
        let result = file_query.delete_path(&root_path.join("fileA"));
        assert!(result.is_ok());

        // Will delete directory
        let result = file_query.delete_path(&root_path.join("dirA"));
        assert!(result.is_ok());
    }

    #[test]
    fn rename_path() {
        let tmp_dir = tempdir::TempDir::new("tempdir").unwrap();
        let root_path = tmp_dir.path().join("root");
        let file_query = RootDirectory::new(&root_path).unwrap();

        File::create(root_path.join("fileA")).unwrap();
        File::create(root_path.join("fileZ")).unwrap();
        create_dir(root_path.join("dirA")).unwrap();

        let out_of_root = tmp_dir.path().join("out_of_root");
        // Will error if a child of root
        let result = file_query.rename_path(&out_of_root.join("fileA"), "fileB");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} is not a child of {}", out_of_root.join("fileA").display(), root_path.display())));

        // Will error if path does not exist
        let result = file_query.rename_path(&root_path.join("fileB"), "fileC");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} does not exist", root_path.join("fileB").display())));

        // Will error if destination exists
        let result = file_query.rename_path(&root_path.join("fileA"), "fileZ");
        assert!(result.is_err());
        assert_eq!(result.err(), Some(format!("Path {} already exists", root_path.join("fileZ").display())));

        // Will rename file
        let result = file_query.rename_path(&root_path.join("fileA"), "fileB");
        assert!(result.is_ok());
        assert!(!root_path.join("fileA").exists());
        assert!(root_path.join("fileB").exists());

        // Will rename directory
        let result = file_query.rename_path(&root_path.join("dirA"), "dirB");
        assert!(result.is_ok());
        assert!(!root_path.join("dirA").exists());
        assert!(root_path.join("dirB").exists());
    }
}