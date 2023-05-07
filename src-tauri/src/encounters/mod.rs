mod character;


pub struct Encounter {
    id: ulid::Ulid,
    name: String,
    characters: Vec<character::Character>,
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
}