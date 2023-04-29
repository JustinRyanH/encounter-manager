import { v4 } from "uuid";
import { TauriConnection } from "~/services/TauriConnection";
import { FileChangeEvent, FileData } from "~/BackendTypes";
import { queryRootDirectory } from "./FileCommands";
import { ReadonlyValueObserver, ValueObserver } from "./ValueObserver";

export class BaseFileManager {
    #uuid: string;

    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}

class File { }
class Directory {
    #files = new ValueObserver<File[]>([]);
    #directories = new ValueObserver<Directory[]>([]);
}

export class TauriFileManager extends BaseFileManager {
    #connection;

    constructor() {
        super();
        this.#connection = new TauriConnection<FileChangeEvent>({ name: "file_system:update" });
        this.#connection.addConnection((event) => {
            console.log(event);
        });
    }

    async startWatching() {
        this.#connection.start();
    }
}