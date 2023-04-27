import { Event, listen, UnlistenFn } from "@tauri-apps/api/event";
import { Signal, SignalConnection } from "typed-signals";

type EventCallback<T> = (message: T) => void;

export class TauriConnection<T> {
    #isWatching = false;
    #waitingForStopListening = false;
    #stopListening: UnlistenFn | null = null;
    #signal = new Signal<EventCallback<T>>();
    #map = new Map<EventCallback<T>, SignalConnection>();
    #name;

    constructor({ name }: { name: string }) {
        this.#name = name;

    }

    get name() {
        return this.#name;
    }

    get isWatching() {
        return this.#isWatching;
    }

    get isAbleToStop() {
        return Boolean(this.#stopListening);
    }

    get numberOfConnections() {
        return this.#map.size;
    }

    async start() {
        if (this.isAbleToStop) return;
        if (this.#isWatching) return;
        this.#waitingForStopListening = true;
        const unListenPromise = listen(this.name, this.receiveMessage);
        this.#isWatching = true;
        this.#stopListening = await unListenPromise;
        this.#waitingForStopListening = false;
    }

    async stop(): Promise<void> {
        return await new Promise((resolve) => {
            this.#map.forEach((connection) => connection.disconnect());
            this.#map.clear();
            const internal = setInterval(() => {
                if (this.isAbleToStop) {
                    if (this.#stopListening) this.#stopListening();
                    if (!this.#stopListening) console.error("Something went very wrong");
                    this.#stopListening = null;
                    clearInterval(internal);
                    resolve();
                }
            }, 100);
        });
    }

    public addConnection(callback: EventCallback<T>): void {
        const connection = this.signal.connect(callback);
        this.#map.set(callback, connection);
    }

    public removeConnection(callback: EventCallback<T>): void {
        const connection = this.#map.get(callback);
        if (connection) connection.disconnect();
    }

    private receiveMessage = (message: Event<T>) => {
        this.#signal.emit(message.payload);
    };

    private get signal() {
        return this.#signal;
    }
}