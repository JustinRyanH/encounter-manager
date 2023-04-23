import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";

export class ViewEncounter {
    #encounter: Encounter;
    #openededCharacters: Array<ActiveCharacter> = [];

    constructor({ encounter }: { encounter: Encounter }) {
        this.#encounter = encounter;
    }

    get openedCharacters(): Array<ActiveCharacter> {
        if (!this.#encounter.activeCharacter) return this.#openededCharacters;
        return [this.#encounter.activeCharacter, ...this.#openededCharacters];
    }

    open(characterId: string): void {
        const character = this.#encounter.characters.find(character => character.id === characterId);
        if (character) {
            this.#openededCharacters = [...this.#openededCharacters, character];
        }
    }
}