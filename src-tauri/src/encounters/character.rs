use std::cmp::Ordering;
use serde::{Deserialize, Serialize};

#[derive(Copy, Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct HitPoints {
    pub current: i32,
    pub max: i32,
    pub temporary: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Character {
    id: ulid::Ulid,
    pub name: String,
    pub hp: HitPoints,
    pub initiative: i32,
    pub initiative_modifier: i32,
}

impl Character {
    pub fn new<T: Into<String>>(name: T, max_hp: i32, initiative: i32) -> Character {
        let hp = HitPoints {
            current: max_hp,
            max: max_hp,
            temporary: 0,
        };
        Character {
            id: ulid::Ulid::new(),
            name: name.into(),
            hp,
            initiative,
            initiative_modifier: 0,
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn is_same_as(&self, other: &Character) -> bool {
        self.id() == other.id()
    }

    pub fn is_similar_to(&self, other: &Character) -> bool {
        self.name == other.name
    }

    pub fn set_initiative_match_score(&mut self, score: i32) {
        self.initiative_modifier = score;
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
        let max_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), max_hp, initiative);
        assert_eq!(character.name, name);
        assert_eq!(character.hp.current, max_hp);
        assert_eq!(character.hp.max, max_hp);
        assert_eq!(character.hp.temporary, 0);
        assert_eq!(character.initiative, initiative);
        assert_eq!(character.initiative_modifier, 0);
        assert_eq!(character.id().len(), 26);
    }

    #[test]
    fn test_is_same_as() {
        let name = String::from("Test Character");
        let max_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), max_hp, initiative);
        let other_character = Character::new(name.clone(), max_hp, initiative);
        let cloned_character = character.clone();
        assert_eq!(character.is_same_as(&other_character), false);
        assert_eq!(character.is_same_as(&cloned_character), true);
    }

    #[test]
    fn test_is_similar_to() {
        let name = String::from("Test Character");
        let max_hp = 10;
        let initiative = 10;
        let character = Character::new(name.clone(), max_hp, initiative);
        let other_character = Character::new(name.clone(), max_hp, initiative);
        let cloned_character = character.clone();
        assert_eq!(character.is_similar_to(&other_character), true);
        assert_eq!(character.is_similar_to(&cloned_character), true);
    }

    #[test]
    fn test_partial_ordering() {
        let max_hp = 10;
        let character_a = Character::new("character a", max_hp, 10);
        let character_b = Character::new("character b", max_hp, 9);
        let character_c = Character::new("character c", max_hp, 11);
        let mut character_d = Character::new("character d", max_hp, 10);
        let mut character_e = Character::new("character e", max_hp, 10);
        character_d.set_initiative_match_score(18);
        character_e.set_initiative_match_score(5);

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
}
