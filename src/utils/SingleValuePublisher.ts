interface PublishedMessageProps<T> {
    publisher: SingleValuePublisher<T>;
    newValue: T;
    oldValue: T;
}

type SingleValueMessage<T> = (props: PublishedMessageProps<T>) => void;

/**
 * A class that can be used to publish a single value to multiple subscribers.
 */
export class SingleValuePublisher<T> {
    #value: T;
    #subscribers: Array<SingleValueMessage<T>> = [];

    constructor(value: any) {
        this.#value = value;
    }

    /**
     * The current value of the publisher.
     */
    get value(): T {
        return this.#value;
    }

    /**
     * Sets the value of the publisher and notifies all subscribers.
     */
    set value(value: T) {
        const oldValue = this.#value;
        this.#value = value;
        this.#subscribers.forEach((subscriber) => subscriber({ publisher: this, newValue: value, oldValue }));
    }

    /**
     * Sets the value to the given value and notifies all subscribers.
     * 
     * An alias for `value = value`.
     * @alias value = value
     * @param {T} value 
     */
    updateValue(value: T): void {
        this.value = value;
    }

    /**
     * Adds a subscriber to the publisher.
     * @param {SingleValueMessage<T>} subscriber 
     */
    subscribe(subscriber: SingleValueMessage<T>): void {
        this.#subscribers.push(subscriber);
    }

    /**
     * Removes a subscriber from the publisher.
     * @param {SingleValueMessage<T>} subscriber 
     */
    unscribe(subscriber: SingleValueMessage<T>): void {
        this.#subscribers = this.#subscribers.filter((s) => s !== subscriber);
    }
}