use std::cmp::Ordering;

use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

use crate::services::FrontendMessage;

#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub struct CharacterChangeMessages {
    pub name: Vec<FrontendMessage>,
    pub initiative: Vec<FrontendMessage>,
    pub hp: Vec<FrontendMessage>,
}

impl CharacterChangeMessages {
    pub fn none() -> Self {
        Self::default()
    }

    pub fn with_name_error_message<T: Into<String>>(mut self, message: T) -> Self {
        self.add_name_error_message(message);
        self
    }

    pub fn add_name_error_message<T: Into<String>>(&mut self, message: T) {
        let message = FrontendMessage::error(message);
        if !(self.name.contains(&message)) {
            self.name.push(message);
        }
    }

    pub fn is_empty(&self) -> bool {
        self.name.is_empty() && self.initiative.is_empty() && self.hp.is_empty()
    }
}


#[derive(Copy, Clone, Debug, Serialize, Deserialize, Eq, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub struct HitPoints {
    pub current: i32,
    pub total: i32,
    pub temporary: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq, Type)]
#[serde(rename_all = "camelCase")]
pub struct Character {
    id: Uuid,
    pub name: String,
    pub hp: HitPoints,
    pub initiative: i32,
    pub initiative_modifier: i32,
}

impl Character {
    pub fn new<T: Into<String>>(name: T, total_hp: i32, initiative: i32) -> Character {
        let hp = HitPoints {
            current: total_hp,
            total: total_hp,
            temporary: 0,
        };
        Character {
            id: Uuid::new_v4(),
            name: name.into(),
            hp,
            initiative,
            initiative_modifier: 0,
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn uuid(&self) -> Uuid {
        self.id
    }

    pub fn is_same_as(&self, other: &Character) -> bool {
        self.id() == other.id()
    }

    pub fn set_name<T>(&mut self, name: T) -> Result<(), String>
        where T: Into<String> {
        let name = name.into();
        if name.is_empty() {
            return Err("Name cannot be empty".to_string());
        }
        self.name = name;
        Ok(())
    }

    pub fn heal(&mut self, value: i32) {
        self.set_current_hp(self.hp.current + value);
    }

    pub fn damage(&mut self, value: i32) {
        if self.hp.temporary > 0 {
            let change = self.hp.temporary - value;
            if change > 0 {
                self.set_temporary_hp(change);
                return;
            } else {
                self.set_temporary_hp(0);
                self.damage(-change);
                return;
            }
        }
        self.set_current_hp(self.hp.current - value);
    }

    pub fn set_total_hp(&mut self, value: i32) {
        self.hp.total = value.max(1);
        self.hp.current = self.hp.current.min(self.hp.total);
    }

    pub fn set_current_hp(&mut self, value: i32) {
        self.hp.current = value.max(0);
        self.hp.current = self.hp.current.min(self.hp.total);
    }

    pub fn set_temporary_hp(&mut self, value: i32) {
        self.hp.temporary = value.max(0);
    }

    pub fn set_initiative(&mut self, value: i32) {
        self.initiative = value.max(-20);
    }

    pub fn set_initiative_modifier(&mut self, value: i32) {
        self.initiative_modifier = value.max(-20);
    }

    pub fn validation_messages(&self) -> CharacterChangeMessages {
        let mut messages = CharacterChangeMessages::none();
        if self.name.is_empty() {
            messages.add_name_error_message("Name cannot be empty");
        }
        messages
    }
}


impl PartialOrd for Character {
    fn partial_cmp(&self, other: &Character) -> Option<std::cmp::Ordering> {
        match other.initiative.partial_cmp(&self.initiative) {
            Some(std::cmp::Ordering::Equal) => other
                .initiative_modifier
                .partial_cmp(&self.initiative_modifier),
            Some(ordering) => Some(ordering),
            None => None,
        }
    }
}

impl Ord for Character {
    fn cmp(&self, other: &Self) -> Ordering {
        match self.partial_cmp(other) {
            Some(ordering) => ordering,
            None => Ordering::Equal,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::encounters::character::{Character, CharacterChangeMessages};
    use crate::services::FrontendMessage;

    #[test]
    fn test_new_character() {
        let name = String::from("Test Character");
        let total_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), total_hp, initiative);
        assert_eq!(character.name, name);
        assert_eq!(character.hp.current, total_hp);
        assert_eq!(character.hp.total, total_hp);
        assert_eq!(character.hp.temporary, 0);
        assert_eq!(character.initiative, initiative);
        assert_eq!(character.initiative_modifier, 0);
        assert_eq!(character.id().len(), 36);
    }

    #[test]
    fn test_is_same_as() {
        let name = String::from("Test Character");
        let total_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), total_hp, initiative);
        let other_character = Character::new(name.clone(), total_hp, initiative);
        let cloned_character = character.clone();
        assert_eq!(character.is_same_as(&other_character), false);
        assert_eq!(character.is_same_as(&cloned_character), true);
    }

    #[test]
    fn test_partial_ordering() {
        let total_hp = 10;
        let character_a = Character::new("character a", total_hp, 10);
        let character_b = Character::new("character b", total_hp, 9);
        let character_c = Character::new("character c", total_hp, 11);
        let mut character_d = Character::new("character d", total_hp, 10);
        let mut character_e = Character::new("character e", total_hp, 10);
        character_d.initiative_modifier = 18;
        character_e.initiative_modifier = 5;

        let expected_order: [Character; 5] = [
            character_c.clone(),
            character_d.clone(),
            character_e.clone(),
            character_a.clone(),
            character_b.clone(),
        ];

        let mut characters = vec![
            character_a.clone(),
            character_b.clone(),
            character_c.clone(),
            character_d.clone(),
            character_e.clone(),
        ];
        characters.sort();
        assert_eq!(characters, expected_order.to_vec());
    }

    #[test]
    fn test_damage_and_heal() {
        let total_hp = 10;
        let mut character_a = Character::new("character a", total_hp, 10);

        character_a.damage(5);
        assert_eq!(character_a.hp.current, 5);
        character_a.damage(10);
        assert_eq!(character_a.hp.current, 0);

        character_a.heal(5);
        assert_eq!(character_a.hp.current, 5);
        character_a.heal(10);
        assert_eq!(character_a.hp.current, 10);

        character_a.set_temporary_hp(10);
        assert_eq!(character_a.hp.current, 10);
        assert_eq!(character_a.hp.temporary, 10);

        character_a.damage(5);
        assert_eq!(character_a.hp.current, 10);
        assert_eq!(character_a.hp.temporary, 5);

        character_a.damage(10);
        assert_eq!(character_a.hp.current, 5);
        assert_eq!(character_a.hp.temporary, 0);
    }

    #[test]
    fn test_hp_values() {
        let total_hp = 10;
        let mut character_a = Character::new("character a", total_hp, 10);

        assert_eq!(character_a.hp.current, 10);
        assert_eq!(character_a.hp.total, 10);
        assert_eq!(character_a.hp.temporary, 0);

        character_a.set_total_hp(20);
        assert_eq!(character_a.hp.current, 10);

        character_a.set_total_hp(5);
        assert_eq!(character_a.hp.current, 5);

        character_a.set_current_hp(0);
        assert_eq!(character_a.hp.current, 0);

        character_a.set_current_hp(10);
        assert_eq!(character_a.hp.current, 5);

        character_a.set_current_hp(-1);
        assert_eq!(character_a.hp.current, 0);

        character_a.set_total_hp(-1);
        assert_eq!(character_a.hp.total, 1);

        character_a.set_temporary_hp(5);
        assert_eq!(character_a.hp.temporary, 5);


        character_a.set_temporary_hp(-5);
        assert_eq!(character_a.hp.temporary, 0);
    }

    #[test]
    fn test_set_initiative() {
        let total_hp = 10;
        let mut character_a = Character::new("character a", total_hp, 10);

        assert_eq!(character_a.initiative, 10);

        character_a.set_initiative(5);
        assert_eq!(character_a.initiative, 5);

        character_a.set_initiative(-21);
        assert_eq!(character_a.initiative, -20);
    }

    #[test]
    fn test_set_initiative_modifier() {
        let total_hp = 10;
        let mut character_a = Character::new("character a", total_hp, 10);

        assert_eq!(character_a.initiative_modifier, 0);

        character_a.set_initiative_modifier(5);
        assert_eq!(character_a.initiative_modifier, 5);

        character_a.set_initiative_modifier(-21);
        assert_eq!(character_a.initiative_modifier, -20);
    }

    #[test]
    fn test_set_name() {
        let total_hp = 10;
        let mut character_a = Character::new("character a", total_hp, 10);

        assert_eq!(character_a.name, "character a");

        let result = character_a.set_name("character b");
        assert!(result.is_ok());
        assert_eq!(character_a.name, "character b");

        let result = character_a.set_name("");
        assert!(result.is_err());
        assert_eq!(character_a.name, "character b");
        assert_eq!(result.err().unwrap(), "Name cannot be empty");
    }

    #[test]
    fn test_validation_messages() {
        let total_hp = 10;
        let character_a = Character::new("character a", total_hp, 10);

        let messages = character_a.validation_messages();
        assert_eq!(messages, CharacterChangeMessages::none());

        let total_hp = 10;
        let character_a = Character::new("", total_hp, 10);
        let messages = character_a.validation_messages();
        assert!(!messages.name.is_empty());
        assert!(messages.hp.is_empty());
        assert!(messages.initiative.is_empty());

        assert!(messages.name.contains(&FrontendMessage::error("Name cannot be empty")));
    }
}
