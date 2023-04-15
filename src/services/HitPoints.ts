import {ValueObserver} from "~/services/ValueObserver";

interface HitPointsProps {
    total: number;
    current: number;
    temp: number;
}

/**
 * A class that represents a character's hit points.
 */
export class HitPoints {
    #total: ValueObserver<number> = new ValueObserver<number>(0);
    #current: ValueObserver<number> = new ValueObserver<number>(0);
    #temp: ValueObserver<number> = new ValueObserver<number>(0);

    constructor({total, current, temp}: HitPointsProps) {
        this.#total.value = total;
        this.#current.value = current;
        this.#temp.value = temp;
    }

    /**
     * Total hit points.
     */
    get total(): number {
        return this.#total.value;
    }


    /**
     * Update total hit points, and notify observers
     * @param total
     */
    set total(total: number) {
        this.#total.value = total;
    }

    /**
     * Observer for total hit points.
     */
    get totalObserver(): ValueObserver<number> {
        return this.#total;
    }

    /**
     * Current hit points.
     */
    get current(): number {
        return this.#current.value;
    }

    /**
     * Update current hit points, and notify observers
     * @param current
     */
    set current(current: number) {
        this.#current.value = current;
    }

    /**
     * Observer for current hit points.
     */
    get currentObserver(): ValueObserver<number> {
        return this.#current;
    }

    /**
     * Temporary hit points.
     */
    get temp(): number {
        return this.#temp.value;
    }

    /**
     * Update temporary hit points, and notify observers
     * @param temp
     */
    set temp(temp: number) {
        this.#temp.value = temp;
    }

    /**
     * Observer for temporary hit points.
     */
    get tempObserver(): ValueObserver<number> {
        return this.#temp;
    }
}