import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { Event } from "@tauri-apps/api/event";
import { v4 } from "uuid";

interface ExampleStruct {
    name: string;
    age: number;
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

export class TauriFileManager extends BaseFileManager {
    #watching = false;
    #unListen: UnlistenFn | null = null;

    constructor() {
        super();
    }

    async startWatching() {
        if (this.#unListen) console.log('unListen', this.#unListen);
        if (this.#watching) return;
        const unListenPromise = listen("test", (e: Event<ExampleStruct>) => {
            console.log(e.payload)
        });
        console.log('start watching');
        this.#watching = true;
        this.#unListen = await unListenPromise;
    }
}