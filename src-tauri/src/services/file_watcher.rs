use tokio::sync::broadcast;
use std::path::Path;
use notify::{RecursiveMode, Watcher};
use serde::Serialize;
use notify::event::ModifyKind;


pub struct FileWatcher {
    pub watcher: notify::RecommendedWatcher,
    pub receiver: broadcast::Receiver<FileChangEvent>,
}

impl FileWatcher {
    pub fn new() -> Result<Self, String> {
        let (sender, receiver) = broadcast::channel(4);
        let watcher = notify::recommended_watcher(move |res| {
            match res {
                Ok(event) => {
                    println!("event: {:?}", event);
                    let event = FileChangEvent::from(&event);
                    sender.send(event).expect("Could not send event");
                }
                Err(e) => println!("watch error: {:?}", e),
            };
        })
        .map_err(|e| e.to_string())?;
        Ok(Self { watcher, receiver })
    }

    pub fn watch(&mut self, path: &Path) -> Result<(), String> {
        self.watcher
            .watch(path, RecursiveMode::Recursive)
            .map_err(|e| e.to_string())
    }
}

#[derive(Clone, Debug, Copy, Serialize)]
pub enum FileChangEvent {
    Create,
    Delete,
    Modify,
    Rename,
    Ignore,
}

impl From<&notify::Event> for FileChangEvent {
    fn from(value: &notify::Event) -> Self {
        match value.kind {
            notify::EventKind::Any => Self::Ignore,
            notify::EventKind::Create(_) => Self::Create,
            notify::EventKind::Modify(ModifyKind::Name(_)) => Self::Rename,
            notify::EventKind::Modify(_) => Self::Modify,
            notify::EventKind::Remove(_) => Self::Delete,
            notify::EventKind::Other => FileChangEvent::Ignore,
            notify::EventKind::Access(_) => FileChangEvent::Ignore,
        }
    }
}
