import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";

export class Encounters {
    #characters: ValueObserver<Array<InitiativeCharacter>> = new ValueObserver<Array<InitiativeCharacter>>([]);
    constructor({ characters }: { characters?: Array<InitiativeCharacter> } = {}) {
        if (characters) {
            this.#characters.value = Array.from(characters).sort((a, b) => b.initiative - a.initiative);
        }
    }

    get characters(): Array<InitiativeCharacter> {
        return this.#characters.value;
    }

    get charactersObserver(): ReadonlyValueObserver<Array<InitiativeCharacter>> {
        return this.#characters.readonly;
    }
}