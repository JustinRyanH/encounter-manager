import { HitPoints } from "~/services/HitPoints";
import { ValueObserver } from "./ValueObserver";

interface InitiativeCharacterProps {
    name: string;
    initiative: number;
    hp?: number;
}

/**
 * A Tracked Character
 */
export class InitiativeCharacter {
    #name: ValueObserver<string>;
    #initiative: ValueObserver<number>;
    #hp: HitPoints = new HitPoints();

    constructor({ name, initiative, hp = 10 }: InitiativeCharacterProps) {
        this.#initiative = new ValueObserver(initiative);
        this.#name = new ValueObserver(name);
        this.#hp.total = hp;
        this.#hp.current = hp;
    }

    /**
     * The name of the character
     */
    get name(): string {
        return this.#name.value;
    }


    /**
     * Update name of the character, and notify observers
     * @param name
     */
    set name(name: string) {
        this.#name.value = name;
    }

    /**
     * Observer for the name of the character
     */
    get nameObserver(): ValueObserver<string> {
        return this.#name;
    }

    /**
     * The initiative of the character
     */
    get initiative(): number {
        return this.#initiative.value;
    }

    /**
     * Update initiative of the character, and notify observers
     * @param initiative
     */
    set initiative(initiative: number) {
        this.#initiative.value = initiative;
    }

    /**
     * Observer for the initiative of the character
     */
    get initiativeObserver(): ValueObserver<number> {
        return this.#initiative;
    }

    get hp(): HitPoints {
        return this.#hp;
    }
}