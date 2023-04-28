use std::path::Path;


use notify::{RecursiveMode, Watcher};
use notify::event::ModifyKind;
use serde::Serialize;
use tauri::async_runtime;
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

    pub fn watch(&mut self, path: &Path) -> Result<(), String> {
        self.watcher
            .watch(path, RecursiveMode::Recursive)
            .map_err(|e| e.to_string())
    }

    pub fn push_to_frontend(&mut self) {
        let mut receiver = self.sender.subscribe();
        async_runtime::spawn(async move {
            loop {
                let event = receiver.recv().await.expect("Could not receive event");
                println!("event: {:?}", event);
            }
        });
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
