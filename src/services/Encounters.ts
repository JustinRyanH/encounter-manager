import { InitiativeCharacter } from "~/services/InititativeCharacter";
import {
    ReadonlyValueObserver,
    StopObserving,
    ValueObserver
} from "~/services/ValueObserver";

const sortInitiative = (a: InitiativeCharacter, b: InitiativeCharacter) => b.initiative - a.initiative;

export class Encounters {
    #initiativeMap: Map<string, StopObserving> = new Map();
    #activeCharacter: ValueObserver<InitiativeCharacter | null> = new ValueObserver<InitiativeCharacter | null>(null);
    #characters: ValueObserver<Array<InitiativeCharacter>> = new ValueObserver<Array<InitiativeCharacter>>([]);

    constructor({ characters }: { characters?: Array<InitiativeCharacter> } = {}) {
        if (characters) this.setCharacters(characters);
        this.#activeCharacter.value = this.characters[0];
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

    get activeCharacter(): InitiativeCharacter | null {
        return this.#activeCharacter.value;
    }

    /**
     * Returns a readonly observer for the active character.
     */
    get activeCharacterObserver(): ReadonlyValueObserver<InitiativeCharacter | null> {
        return this.#activeCharacter.readonly;
    }

    /**
     * Adds a character to the encounter and sorts the characters by initiative.
     * @param initiativeCharacter
     */
    addCharacter = (initiativeCharacter: InitiativeCharacter) => {
        this.setCharacters([...this.characters, initiativeCharacter]);
    }

    /**
     * Sets the active character to the next character in the initiative order.
     */
    nextCharacter = () => {
        if (!this.characters.length) return;
        if (!this.activeCharacter) {
            this.#activeCharacter.value = this.characters[0];
            return;
        }

        const activeCharacterIndex = this.characters.indexOf(this.activeCharacter);
        if (activeCharacterIndex === -1) return;

        const nextCharacterIndex = activeCharacterIndex + 1 === this.characters.length ? 0 : activeCharacterIndex + 1;
        this.#activeCharacter.value = this.characters[nextCharacterIndex];
    };

    private setCharacters = (characters: Array<InitiativeCharacter>) => {
        this.#characters.value = [...characters].sort(sortInitiative);
        this.characters.forEach((character) => {
            const { id } = character;
            const messageCallback = () => this.resortCharacters();
            if (!this.#initiativeMap.has(id)) {
                this.#initiativeMap.set(id, character.observeInitiative(messageCallback));
            }
        });
        this.#initiativeMap.forEach((stopObserving, id) => {
            if (!this.characters.find((character) => character.id === id)) {
                stopObserving();
                this.#initiativeMap.delete(id);
            }
        });
    }

    private resortCharacters = () => {
        this.#characters.value = [...this.characters].sort(sortInitiative);
    }
}