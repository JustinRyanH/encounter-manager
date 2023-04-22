import { v4 as uuidv4 } from "uuid";

import { HitPoints } from "~/services/HitPoints";
import { ReadonlyValueObserver, StopObserving, ValueChangeMessage, ValueObserver } from "./ValueObserver";
import { notifications } from "@mantine/notifications";

interface InitiativeCharacterProps {
    name: string;
    initiative: number;
    hp?: number;
}

/**
 * A Tracked Character
 */
export class ActiveCharacter {
    static ValidateName = (name: string | null): string[] => {
        if (!name) return ['Name cannot be empty'];
        return [];
    }

    static newCharacter(param: InitiativeCharacterProps): ActiveCharacter {
        return new ActiveCharacter(param);
    }

    #id: string = uuidv4();
    #name: ValueObserver<string>;
    #initiative: ValueObserver<number>;
    #hp: HitPoints = new HitPoints();
    #inPlay: ValueObserver<boolean> = new ValueObserver<boolean>(false);

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
        const errors = this.#validateName(name);
        if (errors && errors.length) {
            notifications.show({
                title: 'Invalid Name',
                message: errors.join(', '),
                color: 'red',
            });
            return;
        }

        this.#name.value = name;
    }

    /**
     * Observer for the name of the character
     */
    get nameObserver(): ReadonlyValueObserver<string> {
        return this.#name.readonly;
    }

    /**
     * if the character is in play
     */
    get inPlay(): boolean {
        return this.#inPlay.value;
    }

    /**
     * Update name of the character, and notify observers
     * @param newValue
     */
    set inPlay(newValue: boolean) {
        this.#inPlay.value = newValue;
    }

    /**
     * Observer for the initiative of the character
     */
    get inPlayObserver(): ReadonlyValueObserver<boolean> {
        return this.#inPlay.readonly;
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

    /**
     * The hit points of the character
     */
    get hp(): HitPoints {
        return this.#hp;
    }

    /**
     * Update total hit points, and notify observers
     * @param initiative
     */
    updateInitiative = (initiative: number | null): void => {
        if (initiative === null) {
            notifications.show({
                title: 'Invalid Initiative',
                message: 'Initiative cannot be empty',
                color: 'red',
            });
            return;
        }
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

    #validateName = (name: string | null): string[] => ActiveCharacter.ValidateName(name)
}