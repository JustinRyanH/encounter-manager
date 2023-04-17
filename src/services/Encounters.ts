import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { ReadonlyValueObserver, ValueObserver } from "~/services/ValueObserver";

export class Encounters {
    #characters: ValueObserver<Array<InitiativeCharacter>> = new ValueObserver<Array<InitiativeCharacter>>([]);
    constructor({ characters }: { characters?: Array<InitiativeCharacter> } = {}) {
        if (characters) {
            this.#characters.value = Array.from(characters).sort((a, b) => b.initiative - a.initiative);
        }
    }

    /**
     * Returns the characters in the encounter.
     */
    get characters(): Array<InitiativeCharacter> {
        return this.#characters.value;
    }

    /**
     * Returns a readonly observer for the characters.
     */
    get charactersObserver(): ReadonlyValueObserver<Array<InitiativeCharacter>> {
        return this.#characters.readonly;
    }

    /**
     * Adds a character to the encounter and sorts the characters by initiative.
     * @param initiativeCharacter
     */
    addCharacter = (initiativeCharacter: InitiativeCharacter) => {
        this.#characters.value = [...this.#characters.value, initiativeCharacter]
            .sort((a, b) => b.initiative - a.initiative);
    }
}