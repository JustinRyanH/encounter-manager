import { Encounter } from "~/services/encounter/Encounter";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";

export class ViewEncounter {
    #encounter: Encounter;

    constructor({ encounter }: { encounter: Encounter }) {
        this.#encounter = encounter;
    }

    get openedCharacters(): Array<ActiveCharacter> {
        if (!this.#encounter.activeCharacter) return [];
        return [this.#encounter.activeCharacter];
    }
}