import { ValueObserver } from "~/services";
import { EncounterListType } from "~/types/EncounterTypes";
import * as Commands from './Commands';

export class EncounterManager {
    #encounterList = new ValueObserver<EncounterListType>([]);

    get encounters() {
        return this.#encounterList.value;
    }

    get encountersObserver() {
        return this.#encounterList.readonly;
    }

    async refreshList() {
        this.#encounterList.value = await Commands.listEncounter();
    }
}