use std::path::{Path, PathBuf};

use notify::event::{MetadataKind, ModifyKind, RenameMode};
use notify::{RecursiveMode, Watcher};
use serde::Serialize;
use tokio::sync::broadcast;

use super::FileData;

#[derive(Debug)]
pub struct FileWatcher {
    pub watcher: notify::RecommendedWatcher,
    pub sender: broadcast::Sender<FileChangeEvent>,
}

impl FileWatcher {
    pub fn new() -> Result<Self, String> {
        let (sender, _) = broadcast::channel(32);
        let sender_copy = sender.clone();
        let watcher = notify::recommended_watcher(move |res| {
            match res {
                Ok(event) => {
                    let event = FileChangeEvent::from(&event);
                    sender_copy.send(event).expect("Could not send event");
                }
                Err(e) => println!("watch error: {:?}", e),
            };
        })
        .map_err(|e| e.to_string())?;
        Ok(Self { watcher, sender })
    }

    pub fn watch(&mut self, path: &Path, mode: RecursiveMode) -> Result<(), String> {
        self.watcher.watch(path, mode).map_err(|e| e.to_string())
    }
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum FileChangeEvent {
    Create(FileData),
    Delete(FileData),
    Modify(FileData),
    RenameAny {
        path: PathBuf,
    },
    Rename {
        from: PathBuf,
        to: PathBuf,
        data: FileData,
    },
    Ignore,
}

impl From<&notify::Event> for FileChangeEvent {
    fn from(value: &notify::Event) -> Self {
        match value.kind {
            notify::EventKind::Any => Self::Ignore,
            notify::EventKind::Create(_) => {
                let path = value.paths.first().cloned();
                match path {
                    Some(path) => Self::Create(FileData::from(path)),
                    None => Self::Ignore,
                }
            }
            notify::EventKind::Modify(ModifyKind::Name(RenameMode::Both)) => {
                let paths = value.paths.first().zip(value.paths.last());
                match paths {
                    Some((from, to)) => Self::Rename {
                        from: from.clone(),
                        to: to.clone(),
                        data: FileData::from(to),
                    },
                    None => Self::Ignore,
                }
            }
            notify::EventKind::Modify(ModifyKind::Name(_)) => value
                .paths
                .first()
                .map_or(FileChangeEvent::Ignore, |path| Self::RenameAny {
                    path: path.clone(),
                }),
            notify::EventKind::Modify(ModifyKind::Data(_)) => {
                let path = value.paths.first().cloned();
                match path {
                    Some(path) => Self::Modify(FileData::from(path)),
                    None => Self::Ignore,
                }
            }
            notify::EventKind::Modify(ModifyKind::Metadata(MetadataKind::WriteTime)) => {
                let path = value.paths.first().cloned();
                match path {
                    Some(path) => Self::Modify(FileData::from(path)),
                    None => Self::Ignore,
                }
            }
            notify::EventKind::Remove(_) => {
                let path = value.paths.first().cloned();
                match path {
                    Some(path) => Self::Delete(FileData::from(path)),
                    None => Self::Ignore,
                }
            }
            _ => FileChangeEvent::Ignore,
        }
    }
}
