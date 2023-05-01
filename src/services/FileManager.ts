import { v4 } from "uuid";

import { TauriConnection } from "~/services/TauriConnection";
import { DirectoryQueryResponse, FileChangeEvent } from "~/BackendTypes";

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

function ParseDirectoryFromResponse(directory: DirectoryQueryResponse): Directory {
    const files = directory.entries.map(ParseFileFromType);
    return new Directory({ name: directory.data.name, path: directory.data.path, files, loaded: true });
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
    loaded?: boolean;
}

export class File {
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

    set name(value: string) {
        this.#name.value = value;
    }

    get nameObserver() {
        return this.#name.readonly;
    }

    get path() {
        return this.#path.value;
    }

    set path(value: string) {
        this.#path.value = value;
    }

    get pathObserver() {
        return this.#path.readonly;
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

export class Directory extends File {
    #loaded = false;
    #files: ValueObserver<File[]>;

    constructor({ name, path, parent, files = [], loaded = false }: FileDirectoryProps) {
        super({ name, path, parent });
        this.#loaded = loaded;
        if (files.length > 0) this.#loaded = true;
        this.#files = new ValueObserver(files);
        this.updateFileDirectory(files);
    }

    get loaded() {
        return this.#loaded;
    }

    get entries() {
        return this.#files.value;
    }

    set entries(files: File[]) {
        this.updateFileDirectory(files);
        this.#files.value = files;
    }

    get filesObserver() {
        return this.#files.readonly;
    }

    get type() {
        return 'directory';
    }

    private updateFileDirectory(files: File[]) {
        files.forEach(file => file.parent = this);
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

    get rootDirectoryObserver() {
        return this.#rootDirectory.readonly;
    }

    findFile(path: string): File | null {
        return this.#fileMap.get(path) || null;
    }

    async startWatching() {
        this.#connection.start();
    }

    async loadRootDirectory() {
        if (!this.#rootDirectory) return;

        const { directory } = await queryRootDirectory();
        if (!directory) throw new Error("No root directory found");
        const root = ParseDirectoryFromResponse(directory);

        this.#rootDirectory.value = root;
        this.#fileMap.set(root.path, root);
        root.entries
            .forEach(file => this.#fileMap.set(file.path, file));
    }
}