import { v4 as uuidv4 } from "uuid";

import { HitPoints } from "~/services/HitPoints";
import { ReadonlyValueObserver, ValueObserver } from "./ValueObserver";
import { I } from "@tauri-apps/api/path-e12e0e34";

interface InitiativeCharacterProps {
    name: string;
    initiative: number;
    hp?: number;
}

/**
 * A Tracked Character
 */
export class InitiativeCharacter {
    #id: string = uuidv4();
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
     * Returns a globally unique identifier for this character instance
     */
    get id() {
        return this.#id;
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
    get nameObserver(): ReadonlyValueObserver<string> {
        return this.#name.readonly;
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
    get initiativeObserver(): ReadonlyValueObserver<number> {
        return this.#initiative.readonly;
    }

    get hp(): HitPoints {
        return this.#hp;
    }

    static newCharacter(param: InitiativeCharacterProps): InitiativeCharacter {
        return new InitiativeCharacter(param);
    }
}