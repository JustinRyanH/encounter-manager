use std::path::{Path, PathBuf};

use notify::event::{ModifyKind, RenameMode};
use notify::{RecursiveMode, Watcher};
use serde::Serialize;
use tokio::sync::broadcast;

#[derive(Debug)]
pub struct FileWatcher {
    pub watcher: notify::RecommendedWatcher,
    pub sender: broadcast::Sender<FileChangEvent>,
}

impl FileWatcher {
    pub fn new() -> Result<Self, String> {
        let (sender, _) = broadcast::channel(4);
        let sender_copy = sender.clone();
        let watcher = notify::recommended_watcher(move |res| {
            match res {
                Ok(event) => {
                    println!("event: {:?}", event);
                    let event = FileChangEvent::from(&event);
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
pub enum FileChangEvent {
    Create {
        path: Option<PathBuf>,
    },
    Delete {
        path: Option<PathBuf>,
    },
    Modify {
        path: Option<PathBuf>,
    },
    RenameAny {
        path: Option<PathBuf>,
    },
    RenameBoth {
        from: Option<PathBuf>,
        to: Option<PathBuf>,
    },
    Ignore,
}

impl From<&notify::Event> for FileChangEvent {
    fn from(value: &notify::Event) -> Self {
        match value.kind {
            notify::EventKind::Any => Self::Ignore,
            notify::EventKind::Create(_) => Self::Create {
                path: value.paths.first().cloned(),
            },
            notify::EventKind::Modify(ModifyKind::Name(RenameMode::Both)) => Self::RenameBoth {
                from: value.paths.first().cloned(),
                to: value.paths.last().cloned(),
            },
            notify::EventKind::Modify(ModifyKind::Name(_)) => Self::RenameAny {
                path: value.paths.first().cloned(),
            },
            notify::EventKind::Modify(_) => Self::Modify {
                path: value.paths.first().cloned(),
            },
            notify::EventKind::Remove(_) => Self::Delete {
                path: value.paths.first().cloned(),
            },
            notify::EventKind::Other => FileChangEvent::Ignore,
            notify::EventKind::Access(_) => FileChangEvent::Ignore,
        }
    }
}
