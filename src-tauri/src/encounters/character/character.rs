use std::cmp::Ordering;

use serde::{Deserialize, Serialize};
use specta::Type;
use uuid::Uuid;

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

    pub fn is_similar_to(&self, other: &Character) -> bool {
        self.name == other.name
    }

    pub fn set_name<T>(&mut self, name: T) where T: Into<String> {
        let name = name.into();
        if name.is_empty() {
            return;
        }
        self.name = name;
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
    use crate::encounters::character::Character;

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
    fn test_is_similar_to() {
        let name = String::from("Test Character");
        let total_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), total_hp, initiative);
        let other_character = Character::new(name.clone(), total_hp, initiative);
        let cloned_character = character.clone();
        assert_eq!(character.is_similar_to(&other_character), true);
        assert_eq!(character.is_similar_to(&cloned_character), true);
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

        character_a.set_name("character b");
        assert_eq!(character_a.name, "character b");

        character_a.set_name("");
        assert_eq!(character_a.name, "character b");
    }
}
