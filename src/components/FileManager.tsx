import React from "react";
import { NullFileManger, TauriFileManager } from "~/services/FileManager";


type FileManager = NullFileManger | TauriFileManager


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