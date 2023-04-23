import { Encounter } from "~/services/encounter/Encounter";
import { ReadonlyValueObserver } from "~/services/ValueObserver";
import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";

class ViewEncounter {
    #encounter: Encounter;
    #activeCharacterObserver: ReadonlyValueObserver<ActiveCharacter | null>;

    constructor({ encounter }: { encounter: Encounter }) {
        this.#encounter = encounter;
        this.#activeCharacterObserver = this.#encounter.activeCharacterObserver;
    }
}