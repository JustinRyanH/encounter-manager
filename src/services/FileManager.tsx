import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { Event } from "@tauri-apps/api/event";
import { v4 } from "uuid";

class TauriConnection<T> {
    #isWatching = false;
    stopListening: UnlistenFn | null = null;
    #name;

    constructor({ name }: { name: string }) {
        this.#name = name;

    }

    get name() {
        return this.#name;
    }

    async start() {
        if (this.stopListening) return;
        if (this.#isWatching) return;
        const unListenPromise = listen(this.name, this.receiveMessage);
        this.#isWatching = true;
        this.stopListening = await unListenPromise;
    }

    private receiveMessage = (message: Event<T>) => {
        console.log(message);
    };
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