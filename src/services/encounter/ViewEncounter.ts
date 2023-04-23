import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { ValueChangeMessageProps, ValueObserver } from "~/services/ValueObserver";

export class ViewEncounter {
    #encounter: Encounter;
    #openededCharacters = new ValueObserver<ActiveCharacter[]>([]);

    constructor({ encounter }: { encounter: Encounter }) {
        this.#encounter = encounter;
        this.#encounter.activeCharacterObserver.add(this.onChangeActiveCharacter);
    }

    get openedCharacters(): Array<ActiveCharacter> {
        return this.#openededCharacters.value;
    }

    open(characterId: string): void {
        const character = this.#encounter.characters.find(character => character.id === characterId);
        if (character) {
            this.#openededCharacters.value = [...this.openedCharacters, character];
        }
    }

    close(characterId: string): void {
        this.#openededCharacters.value = this.openedCharacters.filter(character => character.id !== characterId);
    }

    toggle(characterId: string): void {
        if (this.isOpened(characterId)) {
            this.close(characterId);
        } else {
            this.open(characterId);
        }
    }

    isOpened(characterId: string): boolean {
        return this.openedCharacters.some(character => character.id === characterId);
    }

    private onChangeActiveCharacter = ({ oldValue, newValue }: ValueChangeMessageProps<ActiveCharacter | null>) => {
        let oldValues: Array<ActiveCharacter> = this.openedCharacters;
        if (oldValue) {
            oldValues = oldValues.filter(character => character.id !== oldValue.id);
        }
        if (newValue) {
            this.#openededCharacters.updateValue([newValue, ...oldValues]);
        } else {
            this.#openededCharacters.updateValue(oldValues);
        }
    }
}