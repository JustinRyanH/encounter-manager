import { v4 as uuidv4 } from "uuid";

import { HitPoints } from "~/services/HitPoints";
import { ReadonlyValueObserver, StopObserving, ValueChangeMessage, ValueObserver } from "./ValueObserver";

interface InitiativeCharacterProps {
    name: string;
    initiative: number;
    hp?: number;
}

/**
 * A Tracked Character
 */
export class InitiativeCharacter {
    static newCharacter(param: InitiativeCharacterProps): InitiativeCharacter {
        return new InitiativeCharacter(param);
    }

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

    get inPlay(): boolean {
        return false;
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

    /**
     * Update total hit points, and notify observers
     * @param initiative
     */
    updateInitiative: (initiative: number) => void = (initiative: number) => {
        this.initiative = initiative;
    };

    /**
     * Update total hit points, and notify observers
     * @param name
     */
    updateName = (name: string) => {
        this.name = name;
    }

    /**
     * Observer for the initiative of the character
     * @param message
     * @return unsubscribe function
     */
    observeInitiative = (message: ValueChangeMessage<number>): StopObserving => {
        this.#initiative.add(message);
        return () => this.#initiative.remove(message);
    }
}