import { v4 } from "uuid";

import { TauriConnection } from "~/services/TauriConnection";
import { ValueObserver } from "~/services/ValueObserver";

import { queryPath, queryRootDirectory, touchDirectory, touchFile, deletePath, renamePath } from "./Commands";
import { FileData, FileResponse, DirectoryResponse, FileChangeEvent } from "~/fileBindings";

function ParseFileFromType(file: FileData): File | Directory {
  if (file.fileType === "directory") {
    return new Directory({ name: file.name, path: file.path });
  } else {
    return new File({ name: file.name, path: file.path });
  }
}
function ParseFileFromResponse(file: FileResponse): File {
  return new File({ name: file.data.name, path: file.data.path });
}

function ParseDirectoryFromResponse(directory: DirectoryResponse): Directory {
  const files = directory.entries.map(ParseFileFromType);
  return new Directory({
    name: directory.data.name,
    path: directory.data.path,
    files,
    loaded: true,
  });
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
  path: string;
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
    return "file";
  }

  get parent() {
    return this.#parent.value;
  }

  set parent(value) {
    this.#parent.value = value;
  }

  delete() {
    this.#parent.value?.removeFile(this);
    this.#parent.value = null;
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
    this.#files = new ValueObserver(files);
    if (files.length > 0) this.updateFileDirectory(files);
  }

  get allPaths(): string[] {
    const otherPaths: string[] = this.entries.flatMap((file) =>
      file.type === "directory" ? (file as Directory).allPaths : [file.path]
    );

    return [this.path, ...otherPaths];
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
    return this.entries.filter((file) => file.type === "file") as File[];
  }

  get directories() {
    return this.entries.filter((file) => file.type === "directory") as Directory[];
  }

  get filesObserver() {
    return this.#files.readonly;
  }

  get type() {
    return "directory";
  }

  getFileFromPath(path: string): File | null {
    return this.entries.find((file) => file.path === path) || null;
  }

  hasfileOfPath(path: string): boolean {
    return this.entries.some((file) => file.path === path);
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
    this.#files.value = this.#files.value.filter((f) => f.path !== file.path);
  }

  delete(): void {
    super.delete();
    this.#files.value.forEach((file) => file.delete());
    this.#files.value = [];
  }

  private updateFileDirectory(files: File[]) {
    files.forEach((file) => (file.parent = this));
    this.#loaded = true;
  }

  private get entryPaths() {
    return this.entries.map((file) => file.path);
  }
}

export class TauriFileManager extends BaseFileManager {
  #fileMap = new Map<string, File>();
  #rootDirectory = new ValueObserver<Directory | null>(null);
  #connection;

  constructor() {
    super();
    this.#connection = new TauriConnection<FileChangeEvent>({
      name: "file_system:update",
    });
    this.#connection.addConnection(this.#handleFileChange);
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

  /**
   * Loads the root directory and all its subdirectories and files.
   */
  async loadRootDirectory() {
    if (!this.#rootDirectory) return;

    const { directory } = await queryRootDirectory();
    if (!directory) throw new Error("No root directory found");
    const root = ParseDirectoryFromResponse(directory);

    this.#rootDirectory.value = root;
    this.#fileMap.set(root.path, root);
    root.entries.forEach((file) => this.#fileMap.set(file.path, file));
    this.#updateFileMap(root.entries);
    let subdirectories = await this.#aggressivelyLoadAllDirectories(root.directories);
    while (subdirectories.length > 0) {
      subdirectories = await this.#aggressivelyLoadAllDirectories(subdirectories);
    }
  }

  /**
   * Loads a file or directory from the path.
   * - Updates existing files and directories or creates new ones.
   */
  async loadPath(path: string): Promise<File> {
    const { directory, file } = await queryPath(path);
    const parentPath = file?.data.parentDir || directory?.data.parentDir || null;
    const parent = this.#getParentDirectory(parentPath);

    if (directory) {
      if (parent.hasfileOfPath(path)) {
        const dir = parent.getFileFromPath(path) as Directory;
        this.#syncFile(dir, parent);
        const entries = directory.entries.map(ParseFileFromType);
        entries.forEach((file) => this.#fileMap.set(file.path, file));
        dir.entries = entries;
        return dir;
      }
      const dir = this.#createNewDirectory({ directory, parent });
      return dir;
    } else if (file) {
      if (parent.hasfileOfPath(path)) return parent.getFileFromPath(path) as File;
      return this.#createNewFile({ file, parent });
    } else {
      throw new Error("No file or directory found");
    }
  }

  async touchFile(directory: Directory, name: string) {
    if (!name) throw new Error("No name provided");
    const { file } = await touchFile(directory.path, name);
    if (!file) throw new Error("No file returned");
    const newFile = ParseFileFromResponse(file);
    this.#fileMap.set(newFile.path, newFile);
    directory.addFile(newFile);
    return newFile;
  }

  async touchDirectory(directory: Directory, name: string) {
    if (!name) throw new Error("No name provided");
    const { directory: newDirectory } = await touchDirectory(directory.path, name);
    if (!newDirectory) throw new Error("No directory returned");
    const dir = ParseDirectoryFromResponse(newDirectory);
    this.#fileMap.set(dir.path, dir);
    directory.addFile(dir);
    return dir;
  }

  async deleteFile(file: File) {
    await deletePath(file.path);
  }

  async renameFile(file: File, newName: string) {
    await renamePath(file.path, newName);
  }

  #handleFileRename({ from, to, newName }: { from: string; to: string; newName: string }) {
    const file = this.findFile(from);
    if (!file) throw new Error("File not found");
    file.name = newName;
    file.path = to;
    this.#fileMap.delete(from);
    this.#fileMap.set(to, file);
  }

  #handleFileRemove({ path }: { path: string }) {
    const file = this.findFile(path);
    if (!file) return;
    if (file.type === "directory") (file as Directory).allPaths.forEach((path) => this.#fileMap.delete(path));

    file.delete();
    this.#fileMap.delete(path);
  }

  #handleNewFile(fileData: FileData) {
    const file = ParseFileFromType(fileData);
    const parent = this.#getParentDirectory(fileData.parentDir);
    parent.addFile(file);
    this.#fileMap.set(file.path, file);
    return file;
  }

  /**
   * Loads all the Directories and files in the directory, and aggressively queries them until all directories are loaded.
   * @param directories
   * @returns
   */
  async #aggressivelyLoadAllDirectories(directories: Directory[]) {
    const directoryPromises = directories.map((directory) => this.loadPath(directory.path));
    const files = await Promise.all(directoryPromises);
    const loadedDirectories = files.filter((files) => files.type === "directory") as Directory[];
    return loadedDirectories.flatMap((directory) => directory.directories);
  }

  /**
   * Creates a new directory and adds it to the parent directory
   */
  #createNewDirectory({ directory: response, parent }: { directory: DirectoryResponse; parent: Directory }) {
    const dir = ParseDirectoryFromResponse(response);
    this.#syncFile(dir, parent);
    return dir;
  }

  /**
   * Creates a new file and adds it to the parent directory
   */
  #createNewFile({ file: response, parent }: { file: FileResponse; parent: Directory }) {
    const file = ParseFileFromResponse(response);
    this.#syncFile(file, parent);
    return file;
  }

  /**
   * Returns the parent directory of the file if it exists
   *
   * @throws Error if the parent directory does not exist or is not a directory
   */
  #getParentDirectory(parentPath: null | string) {
    if (!parentPath || !this.#fileMap.has(parentPath)) throw Error("Loaded file without known directory");

    const parent = this.#fileMap.get(parentPath) as Directory;

    if (!parent) throw new Error("Parent not found");
    if (parent.type !== "directory") throw new Error("Parent is not a directory");
    return parent;
  }

  #updateFileMap(files: File[]) {
    files.forEach((file) => this.#fileMap.set(file.path, file));
  }

  /**
   * Sets the file in the file map and adds it to the parent directory
   */
  #syncFile(dir: File, parent: Directory) {
    this.#fileMap.set(dir.path, dir);
    parent.addFile(dir);
  }

  #handleFileChange = (event: FileChangeEvent) => {
    if ("rename" in event) {
      const { from, to, data } = event.rename;
      this.#handleFileRename({ from, to, newName: data.name });
      return;
    }
    if ("delete" in event) {
      const { path } = event.delete;
      this.#handleFileRemove({ path });
      return;
    }
    if ("create" in event) {
      const fileData = event.create;
      const file = this.#handleNewFile(fileData);
      if (file.type === "directory") this.#aggressivelyLoadAllDirectories([file as Directory]).catch(console.error);
      return;
    }
  };
}
