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
    directories?: Directory[];
}

class File {
    #path: ValueObserver<string>;
    #name: ValueObserver<string>;

    constructor({ name, path }: FileDirectoryProps) {
        this.#path = new ValueObserver(path);
        this.#name = new ValueObserver(name);
    }
}
class Directory extends File {
    #files: ValueObserver<File[]>;
    #directories: ValueObserver<Directory[]>;

    constructor({ name, path, files = [], directories = [] }: FileDirectoryProps) {
        super({ name, path });
        this.#files = new ValueObserver(files);
        this.#directories = new ValueObserver(directories);
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