import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { v4 } from "uuid";

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
        const unListenPromise = listen("test", (e) => {
            console.log(e)
        });
        console.log('start watching');
        this.#watching = true;
        this.#unListen = await unListenPromise;
    }
}