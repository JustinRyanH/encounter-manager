import React from "react";
import { v4 } from "uuid";
import { invoke } from "@tauri-apps/api";


export class BaseFileManager {
    #uuid: string;
    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}
export class NullFileManger extends BaseFileManager {}
export class TauriFileManager extends BaseFileManager {
    constructor() {
        super();
        console.log('createReal', this.uuid);
    }
}


type FileManager = BaseFileManager;


const FileManagerContext: React.Context<FileManager> = React.createContext(new NullFileManger());

interface FileManagerProviderProps {
    children: React.ReactNode;
    fileManager: FileManager;
}

export function FileManagerProvider(props: FileManagerProviderProps): JSX.Element {
    return <FileManagerContext.Provider value={props.fileManager}>{props.children}</FileManagerContext.Provider>;
}

export function useFileManager(): FileManager {
    return React.useContext(FileManagerContext);
}