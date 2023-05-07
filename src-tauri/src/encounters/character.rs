use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Hitpoints {
    pub current: i32,
    pub max: i32,
    pub temporary: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Character {
    ulid: ulid::Ulid,
    pub name: String,
    pub hp: Hitpoints,
    pub initiative: i32,
    pub initiative_match_score: Option<i32>,
}

impl Character {
    pub fn new(name: String, max_hp: i32, initiative: i32) -> Character {
        let hp = Hitpoints {
            current: max_hp,
            max: max_hp,
            temporary: 0,
        };
        Character {
            ulid: ulid::Ulid::new(),
            name,
            hp,
            initiative,
            initiative_match_score: None,
        }
    }

    pub fn id(&self) -> String {
        self.ulid.to_string()
    }
}

#[cfg(test)]
mod tests {
    use crate::encounters::*;
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
        assert_eq!(character.initiative_match_score, None);
        assert_eq!(character.id().len(), 26);
    }
}
