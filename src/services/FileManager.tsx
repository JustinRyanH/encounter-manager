import { v4 } from "uuid";
import { Signal, SignalConnection } from "typed-signals";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { Event } from "@tauri-apps/api/event";

type EventCallback<T> = (message: T) => void;
class TauriConnection<T> {
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

    async start() {
        if (this.#stopListening) return;
        if (this.#isWatching) return;
        this.#waitingForStopListening = true;
        const unListenPromise = listen(this.name, this.receiveMessage);
        this.#isWatching = true;
        this.#waitingForStopListening = false;
        this.#stopListening = await unListenPromise;
    }

    async stop(): Promise<void> {
        return await new Promise((resolve) => {
            this.#map.forEach((connection) => connection.disconnect());
            const internal = setInterval(() => {
                if (this.#waitingForStopListening) {
                    if (this.#stopListening) this.#stopListening();
                    if (!this.#stopListening) console.error("Something went very wrong");
                    clearInterval(internal);
                    resolve();
                }
            });
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
        console.log(message);
    };

    private get signal() {
        return this.#signal;
    }
}
export class BaseFileManager {
    #uuid: string;

    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}

export class NullFileManger extends BaseFileManager {
    constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async startWatching() {
    }
}

interface ExampleStruct {
    name: string;
    age: number,
}

export class TauriFileManager extends BaseFileManager {
    #connection;

    constructor() {
        super();
        this.#connection = new TauriConnection<ExampleStruct>({ name: "test" });
    }

    async startWatching() {
        this.#connection.start();
    }
}