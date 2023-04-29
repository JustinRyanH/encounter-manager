import { v4 } from "uuid";

import { TauriConnection } from "~/services/TauriConnection";
import { FileChangeEvent } from "~/BackendTypes";

import { ValueObserver } from "./ValueObserver";

export class BaseFileManager {
    #uuid: string;

    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}

interface FileDirectoryProps {
    name: string;
    path: string,
    files?: File[];
    parent?: Directory;
}

class File {
    #parent: ValueObserver<Directory | null>;
    #path: ValueObserver<string>;
    #name: ValueObserver<string>;

    constructor({ name, path, parent }: FileDirectoryProps) {
        this.#parent = new ValueObserver(parent || null);
        this.#path = new ValueObserver(path);
        this.#name = new ValueObserver(name);
    }

    get type() {
        return 'file';
    }
}
class Directory extends File {
    #files: ValueObserver<File[]>;

    constructor({ name, path, parent, files = [] }: FileDirectoryProps) {
        super({ name, path, parent });
        this.#files = new ValueObserver(files);
    }

    get type() {
        return 'directory';
    }
}

export class TauriFileManager extends BaseFileManager {
    #fileMap = new Map<string, File>();
    #rootDirectory = new ValueObserver<Directory | null>(null);
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