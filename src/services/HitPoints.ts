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
    #total: ValueObserver<number> = new ValueObserver(0);
    #current: ValueObserver<number> = new ValueObserver(0);
    #temp: ValueObserver<number | null> = new ValueObserver<number | null>(null);

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
        this.#current.value = Math.min(current, this.total);
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
    get temp(): number | null {
        return this.#temp.value;
    }

    /**
     * Update temporary hit points, and notify observers
     * @param temp
     */
    set temp(temp: number | null) {
        this.#temp.value = temp;
    }

    /**
     * Observer for temporary hit points.
     */
    get tempObserver(): ValueObserver<number | null> {
        return this.#temp;
    }
}