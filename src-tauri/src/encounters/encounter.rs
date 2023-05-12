use std::collections::HashMap;
use std::sync::{Arc, LockResult};

use tokio::sync::{Mutex, MutexGuard};
use tauri::State;
use serde::{Deserialize, Serialize};
use tauri::utils::assets::phf::PhfHash;
use ulid::Ulid;
use crate::encounters::Character;
use crate::encounters::character::{CharacterCommand, CharacterCommandResponse};

pub type EncounterManagerState<'a> = State<'a, EncounterManager>;

#[derive(Clone, Debug)]
pub struct EncounterManager(Arc<Mutex<EncounterCollection>>);

impl EncounterManager {
    pub async fn lock(&self) -> MutexGuard<'_, EncounterCollection> {
        self.0.lock().await
    }
}

impl From<EncounterCollection> for EncounterManager {
    fn from(encounter_collection: EncounterCollection) -> Self {
        Self(Arc::new(Mutex::new(encounter_collection)))
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncounterCollection {
    pub encounters: HashMap<Ulid, Encounter>,
}

impl EncounterCollection {
    pub fn new() -> EncounterCollection {
        EncounterCollection {
            encounters: HashMap::new(),
        }
    }

    pub fn add_encounter(&mut self, encounter: Encounter) {
        self.encounters.insert(encounter.id, encounter);
    }

    pub fn list_encounters(&self) -> HashMap<Ulid, Encounter> {
        self.encounters.clone()
    }

    pub fn find_encounter_mut(&mut self, id: Ulid) -> Option<&mut Encounter> {
        self.encounters.get_mut(&id)
    }
}


#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Encounter {
    id: Ulid,
    name: String,
    characters: Vec<Character>,
}

impl Encounter {
    pub fn new<T: Into<String>>(name: T) -> Encounter {
        Encounter {
            id: ulid::Ulid::new(),
            name: name.into(),
            characters: Vec::new(),
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn ulid(&self) -> ulid::Ulid {
        self.id
    }

    pub fn add_character(&mut self, new_character: Character) {
        if self.characters.iter().any(|c| c.is_same_as(&new_character)) {
            return;
        }
        self.characters.push(new_character);
        self.characters.sort();
    }

    pub fn find_character(&self, id: String) -> Option<&Character> {
        self.characters.iter().find(|c| c.id() == id)
    }

    pub fn find_character_mut(&mut self, id: Ulid) -> Option<&mut Character> {
        self.characters.iter_mut().find(|c| c.ulid() == id)
    }

    pub fn get_characters(&self) -> Vec<Character> {
        self.characters.clone()
    }

    pub fn remove_character(&mut self, character: Character) {
        self.characters.retain(|c| !c.is_same_as(&character));
    }

    pub fn update_character(&mut self, cmd: CharacterCommand) -> Result<CharacterCommandResponse, String> {
        match cmd {
            CharacterCommand::UpdateName { id, name } => {
                if let Some(character) = self.find_character_mut(id) {
                    character.update_name(name);
                    Ok(CharacterCommandResponse::updated(character))
                } else {
                    Err(format!("Character with id {} not found", id))
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::encounters::*;
    use crate::encounters::character::CharacterCommandResponse;
    use crate::encounters::encounter::Encounter;

    #[test]
    fn test_new_encounter() {
        let name = String::from("Test Encounter");
        let encounter = Encounter::new(name.clone());
        assert_eq!(encounter.name, name);
        assert_eq!(encounter.characters.len(), 0);
        assert_eq!(encounter.id().len(), 26);
    }

    #[test]
    fn add_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character = character::Character::new(String::from("Test Character"), 10, 10);
        encounter.add_character(character.clone());
        encounter.add_character(character.clone());
        assert_eq!(encounter.get_characters().len(), 1);
    }

    #[test]
    fn remove_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character_a = character::Character::new("Character A", 10, 10);
        let character_b = character::Character::new("Character B", 10, 5);
        encounter.add_character(character_a.clone());
        encounter.add_character(character_b.clone());
        encounter.remove_character(character_a.clone());
        assert_eq!(encounter.get_characters(), vec![character_b]);
    }

    #[test]
    fn auto_sorts_new_characters() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = character::Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = character::Character::new(String::from("Test Character 2"), 10, 20);
        encounter.add_character(character2.clone());
        encounter.add_character(character1.clone());
        assert_eq!(encounter.get_characters()[0].name, character2.name);
        assert_eq!(encounter.get_characters()[1].name, character1.name);
    }

    #[test]
    fn find_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = character::Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = character::Character::new(String::from("Test Character 2"), 10, 20);
        encounter.add_character(character1.clone());

        assert_eq!(encounter.find_character(character1.id()).unwrap().name, character1.name);
        assert_eq!(encounter.find_character(character2.id()), None);
    }

    #[test]
    fn update_character_command() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = character::Character::new(String::from("Test Character 1"), 10, 10);
        encounter.add_character(character1.clone());

        let cmd = character::CharacterCommand::UpdateName {
            id: character1.ulid(),
            name: String::from("New Name"),
        };

        let response = encounter.update_character(cmd).unwrap();
        let updated_character = encounter.find_character(character1.id()).unwrap();
        assert_eq!(response, CharacterCommandResponse::UpdatedCharacter(updated_character.clone()));
    }
}
