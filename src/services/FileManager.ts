import { v4 } from "uuid";

import { TauriConnection } from "~/services/TauriConnection";
import { FileChangeEvent } from "~/BackendTypes";

import { ValueObserver } from "./ValueObserver";
import { queryRootDirectory } from "./FileCommands";
import { FileData } from "~/BackendTypes";

function ParseFileFromType(file: FileData): File | Directory {
    if (file.fileType === 'directory') {
        return new Directory({ name: file.name, path: file.path });
    } else {
        return new File({ name: file.name, path: file.path });
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

    get name() {
        return this.#name.value;
    }

    get path() {
        return this.#path.value;
    }

    get type() {
        return 'file';
    }

    get parent() {
        return this.#parent.value;
    }

    set parent(value) {
        this.#parent.value = value;
    }

    toEqual(file: File) {
        return this.path === file.path;
    }
}

class Directory extends File {
    #files: ValueObserver<File[]>;

    constructor({ name, path, parent, files = [] }: FileDirectoryProps) {
        super({ name, path, parent });
        this.#files = new ValueObserver(files);
    }

    get files() {
        return this.#files.value;
    }

    set files(files: File[]) {
        files.forEach(file => file.parent = this);
        this.#files.value = files;
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

    get rootDirectory() {
        return this.#rootDirectory.value;
    }

    async startWatching() {
        this.#connection.start();
    }

    async loadRootDirectory() {
        const { directory } = await queryRootDirectory();
        if (!directory) throw new Error("No root directory found");
        const { data, entries } = directory;
        const root = ParseFileFromType(data) as Directory;
        const files = entries.map(ParseFileFromType);
        root.files = files;
        this.#rootDirectory.value = root;
    }
}