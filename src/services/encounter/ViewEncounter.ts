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

    private onChangeActiveCharacter = ({ newValue }: ValueChangeMessageProps<ActiveCharacter | null>) => {
        if (newValue) {
            this.#openededCharacters.updateValue([newValue, ...this.openedCharacters]);
        }
    }
}