import { InitiativeCharacter } from "~/services/InititativeCharacter";
import {
    ReadonlyValueObserver,
    StopObserving,
    ValueObserver
} from "~/services/ValueObserver";

const sortInitiative = (a: InitiativeCharacter, b: InitiativeCharacter) => b.initiative - a.initiative;

export class Encounters {
    #initiativeMap: Map<string, StopObserving> = new Map();
    #activeCharacter: InitiativeCharacter | null = null;
    #characters: ValueObserver<Array<InitiativeCharacter>> = new ValueObserver<Array<InitiativeCharacter>>([]);

    constructor({ characters }: { characters?: Array<InitiativeCharacter> } = {}) {
        if (characters) this.setCharacters(characters);
        this.#activeCharacter = this.characters[0];
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
        return this.#activeCharacter;
    }

    /**
     * Adds a character to the encounter and sorts the characters by initiative.
     * @param initiativeCharacter
     */
    addCharacter = (initiativeCharacter: InitiativeCharacter) => {
        this.setCharacters([...this.characters, initiativeCharacter]);
    }

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