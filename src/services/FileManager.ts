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

export class TauriFileManager extends BaseFileManager {
    #directories = new Map<string, ValueObserver<FileData[]>>();
    #rootName = new ValueObserver<string>('');
    #connection;

    constructor() {
        super();
        this.#connection = new TauriConnection<FileChangeEvent>({ name: "file_system:update" });
        this.#connection.addConnection((event) => {
            console.log(event);
        });
    }

    get rootName() {
        return this.#rootName.value;
    }

    get rootNamePublisher(): ReadonlyValueObserver<string> {
        return this.#rootName.readonly;
    }

    getDirectory(name: string): ReadonlyValueObserver<FileData[]> {
        return this.getDirectoryObserver(name).readonly;
    }

    async startWatching() {
        this.#connection.start();
    }

    async getRoot() {
        const result = await queryRootDirectory();
        if (result.type !== 'directory') throw new Error("Root is not a directory");
        if (!result.data.name) throw new Error("Root directory has no name");
        const directoryName = result.data.name;
        const entries = result.entries ?? [];
        this.updateDirectory(directoryName, entries);
        console.log(entries);
        this.#rootName.updateValue(directoryName);
    }

    private updateDirectory(name: string, entries: FileData[]) {
        this.getDirectoryObserver(name).updateValue(entries);
    }

    private getDirectoryObserver(name: string) {
        let observer = this.#directories.get(name);
        if (observer) return observer;
        observer = new ValueObserver<FileData[]>([]);
        this.#directories.set(name, observer);
        return observer;
    }
}