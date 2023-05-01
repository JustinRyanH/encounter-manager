import { v4 } from "uuid";

import { TauriConnection } from "~/services/TauriConnection";
import { DirectoryQueryResponse, FileChangeEvent } from "~/BackendTypes";

import { ValueObserver } from "./ValueObserver";
import { queryPath, queryRootDirectory } from "./FileCommands";
import { FileData } from "~/BackendTypes";
import { FileQueryResponse } from "~/BackendTypes";
import { dir } from "console";

function ParseFileFromType(file: FileData): File | Directory {
    if (file.fileType === 'directory') {
        return new Directory({ name: file.name, path: file.path });
    } else {
        return new File({ name: file.name, path: file.path });
    }
}


function PraseFileFromResponse(file: FileQueryResponse): File {
    return new File({ name: file.data.name, path: file.data.path });
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

    get files() {
        return this.entries.filter(file => file.type === 'file') as File[];
    }

    get directories() {
        return this.entries.filter(file => file.type === 'directory') as Directory[];
    }

    get filesObserver() {
        return this.#files.readonly;
    }

    get type() {
        return 'directory';
    }

    getFileFromPath(path: string): File | null {
        return this.entries.find(file => file.path === path) || null;
    }

    hasfileOfPath(path: string): boolean {
        return this.entries.some(file => file.path === path);
    }

    addFile(file: File) {
        if (this.entryPaths.includes(file.path)) {
            if (!file.parent) return;
            if (file.parent !== this) throw new Error("Parent Changed is not allowed");
            return;
        }
        this.#files.value = [...this.#files.value, file];
        file.parent = this;
    }

    removeFile(file: File) {
        this.#files.value = this.#files.value.filter(f => f.path !== file.path);
    }

    private updateFileDirectory(files: File[]) {
        files.forEach(file => file.parent = this);
    }

    private get entryPaths() {
        return this.entries.map(file => file.path);
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
        root.entries.forEach(file => this.#fileMap.set(file.path, file));
        this.updateFileMap(root.entries);
        const directoryPromises = root.entries
            .filter(file => file.type === 'directory')
            .map(file => this.loadPath(file.path));
        await Promise.all(directoryPromises);
    }

    async loadPath(path: string): Promise<File> {
        const { directory, file } = await queryPath(path);
        const parentPath = file?.data.parentDir || directory?.data.parentDir;
        if (!parentPath || !this.#fileMap.has(parentPath)) {
            throw Error("Loaded file without known directory");
        }
        const parent = this.#fileMap.get(parentPath) as Directory;

        if (!parent) throw new Error("Parent not found");
        if (parent.type !== 'directory') throw new Error("Parent is not a directory");
        if (parent.hasfileOfPath(path)) return parent.getFileFromPath(path) as File;

        if (directory) {
            const dir = ParseDirectoryFromResponse(directory);
            this.#fileMap.set(dir.path, dir);
            parent.addFile(dir);

            return dir;
        } else if (file) {
            const f = PraseFileFromResponse(file);
            this.#fileMap.set(f.path, f);
            parent.addFile(f);

            return f;
        } else {
            throw new Error("No file or directory found");
        }
    }

    private updateFileMap(files: File[]) {
        files.forEach(file => this.#fileMap.set(file.path, file));
    }
}