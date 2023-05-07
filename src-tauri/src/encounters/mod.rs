use crate::encounters::character::Character;

mod character;

#[derive(Clone, Debug)]
pub struct Encounter {
    id: ulid::Ulid,
    name: String,
    characters: Vec<Character>,
}

impl Encounter {
    pub fn new(name: String) -> Encounter {
        Encounter {
            id: ulid::Ulid::new(),
            name,
            characters: Vec::new(),
        }
    }

    pub fn id(&self) -> String {
        self.id.to_string()
    }

    pub fn add_character(&mut self, new_character: Character) {
        if self.characters.iter().any(|c| c.is_same_as(&new_character)) {
            return;
        }
        self.characters.push(new_character);
        self.characters.sort();
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
}