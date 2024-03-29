use std::collections::HashMap;
use std::sync::{Arc};

use tokio::sync::{Mutex, MutexGuard};
use tauri::State;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use specta::Type;

use crate::encounters::Character;
use crate::encounters::character::{CharacterChangeMessages, UpdateCharacterCommand, CharacterCommandResponse};

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
    pub encounters: HashMap<Uuid, Encounter>,
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

    pub fn list_encounters(&self) -> HashMap<Uuid, Encounter> {
        self.encounters.clone()
    }

    pub fn find_encounter_mut(&mut self, id: Uuid) -> Option<&mut Encounter> {
        self.encounters.get_mut(&id)
    }
}


#[derive(Clone, Debug, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct Encounter {
    id: Uuid,
    name: String,
    characters: Vec<Character>,
    active_character: Option<Uuid>,
    last_active_character: Option<Uuid>,
}

impl Encounter {
    pub fn new<T: Into<String>>(name: T) -> Encounter {
        Encounter {
            id: Uuid::new_v4(),
            name: name.into(),
            characters: Vec::new(),
            active_character: None,
            last_active_character: None,
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn get_active_character_id(&self) -> Option<Uuid> {
        self.active_character
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

    pub fn find_character_mut(&mut self, id: Uuid) -> Option<&mut Character> {
        self.characters.iter_mut().find(|c| c.uuid() == id)
    }

    pub fn get_characters(&self) -> Vec<Character> {
        self.characters.clone()
    }

    pub fn remove_character(&mut self, character: Character) {
        self.characters.retain(|c| !c.is_same_as(&character));
    }

    pub fn update_character(&mut self, cmd: UpdateCharacterCommand) -> Result<CharacterCommandResponse, String> {
        let character = self.find_character_mut(cmd.id()).ok_or(format!("Character with id {} not found", cmd.id()))?;

        match cmd {
            UpdateCharacterCommand::UpdateName { name, .. } => {
                character.set_name(name)
                    .map(|_| CharacterCommandResponse::updated(character))
                    .or_else(|e| Ok(CharacterCommandResponse::updated_with_messages(character, CharacterChangeMessages::default().with_name_error_message(e))))
            }
            UpdateCharacterCommand::UpdateInitiative { initiative, .. } => {
                character.set_initiative(initiative);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::UpdateInitiativeModifier { modifier, .. } => {
                character.set_initiative_modifier(modifier);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::UpdateCurrentHp { hp, .. } => {
                character.set_current_hp(hp);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::UpdateTotalHp { hp, .. } => {
                character.set_total_hp(hp);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::UpdateTemporaryHp { hp, .. } => {
                character.set_temporary_hp(hp);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::Heal { hp, .. } => {
                character.heal(hp);
                Ok(CharacterCommandResponse::updated(character))
            }
            UpdateCharacterCommand::Damage { hp, .. } => {
                character.damage(hp);
                Ok(CharacterCommandResponse::updated(character))
            }
        }
    }

    pub fn start(&mut self) -> Result<(), String> {
        match self.active_character.is_some() {
            true => return Err(String::from("Encounter already started")),
            false => self.active_character = self.characters.first().map(|c| c.uuid()),
        }
        self.last_active_character = None;
        Ok(())
    }

    pub fn stop(&mut self) -> Result<(), String> {
        self.last_active_character = None;
        self.active_character = None;
        Ok(())
    }

    pub fn next(&mut self) -> Result<(), String> {
        if let Some(id) = self.active_character {
            let active_character_index = self.characters
                .iter()
                .position(|c| c.uuid() == id)
                .ok_or(String::from("Active character not found"))?;

            let next_character_index = (active_character_index + 1) % self.characters.len();
            self.active_character = Some(self.characters[next_character_index].uuid());
            self.last_active_character = Some(id);
        } else {
            self.active_character = self.characters.first().map(|c| c.uuid());
            self.last_active_character = None;
        }
        Ok(())
    }

    pub fn pause(&mut self) -> Result<() , String> {
        self.last_active_character = self.active_character;
        self.active_character = None;
        Ok(())
    }

    pub fn restart(&mut self) -> Result<() , String> {
        if let Some(id) = self.last_active_character {
            self.active_character = Some(id);
        } else {
            self.active_character = self.characters.first().map(|c| c.uuid());
        }
        self.last_active_character = None;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::encounters::*;
    use crate::encounters::character::{CharacterChangeMessages, CharacterCommandResponse};
    use crate::encounters::encounter::Encounter;

    #[test]
    fn test_new_encounter() {
        let name = String::from("Test Encounter");
        let encounter = Encounter::new(name.clone());
        assert_eq!(encounter.name, name);
        assert_eq!(encounter.characters.len(), 0);
        assert_eq!(encounter.id().len(), 36);
    }

    #[test]
    fn add_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character = Character::new(String::from("Test Character"), 10, 10);
        encounter.add_character(character.clone());
        encounter.add_character(character.clone());
        assert_eq!(encounter.get_characters().len(), 1);
    }

    #[test]
    fn remove_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character_a = Character::new("Character A", 10, 10);
        let character_b = Character::new("Character B", 10, 5);
        encounter.add_character(character_a.clone());
        encounter.add_character(character_b.clone());
        encounter.remove_character(character_a.clone());
        assert_eq!(encounter.get_characters(), vec![character_b]);
    }

    #[test]
    fn auto_sorts_new_characters() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 20);
        encounter.add_character(character2.clone());
        encounter.add_character(character1.clone());
        assert_eq!(encounter.get_characters()[0].name, character2.name);
        assert_eq!(encounter.get_characters()[1].name, character1.name);
    }

    #[test]
    fn find_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 20);
        encounter.add_character(character1.clone());

        assert_eq!(encounter.find_character(character1.id()).unwrap().name, character1.name);
        assert_eq!(encounter.find_character(character2.id()), None);
    }

    #[test]
    fn update_character_command() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        encounter.add_character(character1.clone());

        let cmd = character::UpdateCharacterCommand::UpdateName {
            id: character1.uuid(),
            name: String::from("New Name"),
        };

        let response = encounter.update_character(cmd).unwrap();
        let updated_character = encounter.find_character(character1.id()).unwrap();
        assert_eq!(response, CharacterCommandResponse::UpdatedCharacter { character: updated_character.clone(), messages: CharacterChangeMessages::none() });

        let cmd = character::UpdateCharacterCommand::UpdateInitiative {
            id: character1.uuid(),
            initiative: 20,
        };

        let response = encounter.update_character(cmd).unwrap();
        let updated_character = encounter.find_character(character1.id()).unwrap();
        assert_eq!(response, CharacterCommandResponse::UpdatedCharacter { character: updated_character.clone(), messages: CharacterChangeMessages::none() });
    }

    #[test]
    fn active_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 10);
        encounter.add_character(character1.clone());
        encounter.add_character(character2.clone());

        assert_eq!(encounter.get_active_character_id(), None);
        // Uses First Character
        encounter.start().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));

        // Moves Next
        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));

        // Wraps
        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));

        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));

        let result = encounter.start();
        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), String::from("Encounter already started"));
    }

    #[test]
    fn next_character_sets_active_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 10);
        encounter.add_character(character1.clone());
        encounter.add_character(character2.clone());

        encounter.next().unwrap();

        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));
    }

    #[test]
    fn allow_restarting_a_character() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 10);
        let character3 = Character::new(String::from("Test Character 3"), 10, 10);
        encounter.add_character(character1.clone());
        encounter.add_character(character2.clone());
        encounter.add_character(character3.clone());


        encounter.next().unwrap();
        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));

        encounter.pause().unwrap();
        assert_eq!(encounter.get_active_character_id(), None);

        encounter.restart().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));
    }

    #[test]
    fn restart_encounter() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 10);
        encounter.add_character(character1.clone());
        encounter.add_character(character2.clone());

        encounter.restart().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));

        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));

        encounter.restart().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));
    }

    #[test]
    fn stop_encounter() {
        let mut encounter = Encounter::new(String::from("Test Encounter"));
        let character1 = Character::new(String::from("Test Character 1"), 10, 10);
        let character2 = Character::new(String::from("Test Character 2"), 10, 10);
        encounter.add_character(character1.clone());
        encounter.add_character(character2.clone());

        encounter.start().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));

        encounter.next().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character2.uuid()));

        encounter.stop().unwrap();
        assert_eq!(encounter.get_active_character_id(), None);

        encounter.restart().unwrap();
        assert_eq!(encounter.get_active_character_id(), Some(character1.uuid()));
    }
}
