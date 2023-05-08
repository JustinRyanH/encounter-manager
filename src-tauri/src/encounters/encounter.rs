use std::collections::HashMap;
use tauri::State;
use serde::{Deserialize, Serialize};
use ulid::Ulid;
use crate::encounters::Character;

pub type EncounterCollectionState<'a> = State<'a, EncounterCollection>;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncounterDescription {
    pub id: String,
    pub name: String,
}

impl From<&Encounter> for EncounterDescription {
    fn from(encounter: &Encounter) -> Self {
        Self {
            id: encounter.id(),
            name: encounter.name.clone(),
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EncounterCollection {
    pub encounters: HashMap<ulid::Ulid, Encounter>,
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

    pub fn list_encounters(&self) -> HashMap<Ulid, EncounterDescription> {
        self.encounters
            .values()
            .map(|e| (e.ulid(), e.into()))
            .collect()
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

    pub fn get_characters(&self) -> Vec<Character> {
        self.characters.clone()
    }

    pub fn remove_character(&mut self, character: Character) {
        self.characters.retain(|c| !c.is_same_as(&character));
    }
}

#[cfg(test)]
mod tests {
    use crate::encounters::*;
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
}
