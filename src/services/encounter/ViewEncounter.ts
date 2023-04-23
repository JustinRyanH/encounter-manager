import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { ReadonlyValueObserver, ValueChangeMessageProps, ValueObserver } from "~/services/ValueObserver";

export class ViewEncounter {
    #encounter: Encounter;
    #openededCharacters = new ValueObserver<string[]>([]);

    constructor({ encounter }: { encounter: Encounter }) {
        this.#encounter = encounter;
        this.#encounter.activeCharacterObserver.add(this.onChangeActiveCharacter);
    }

    get openedCharacters(): Array<string> {
        return this.#openededCharacters.value;
    }

    get openedCharactersObserver(): ReadonlyValueObserver<string[]> {
        return this.#openededCharacters.readonly;
    }

    open(characterId: string): void {
        const id = this.#encounter.characters.find(char => char.id === characterId)?.id;
        if (id) {
            this.#openededCharacters.value = [...this.openedCharacters, id];
        }
    }

    close(characterId: string): void {
        this.#openededCharacters.value = this.openedCharacters.filter(character => character !== characterId);
    }

    toggle(characterId: string): void {
        if (this.isOpened(characterId)) {
            this.close(characterId);
        } else {
            this.open(characterId);
        }
    }

    isOpened(characterId: string): boolean {
        return this.openedCharacters.some(character => character === characterId);
    }

    private onChangeActiveCharacter = ({ oldValue, newValue }: ValueChangeMessageProps<ActiveCharacter | null>) => {
        let oldValues: Array<string> = this.openedCharacters;
        if (oldValue) {
            oldValues = oldValues.filter(character => character !== oldValue.id);
        }
        if (newValue) {
            this.#openededCharacters.updateValue([newValue.id, ...oldValues]);
        } else {
            this.#openededCharacters.updateValue(oldValues);
        }
    }
}