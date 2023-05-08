import React from "react";
import { TauriFileManager } from "~/services/files/FileManager";


type FileManager = TauriFileManager;

const FileManagerContext = React.createContext<FileManager | null>(null);

interface FileManagerProviderProps {
    children: React.ReactNode;
    fileManager: FileManager;
}

export function FileManagerProvider(props: FileManagerProviderProps): JSX.Element {
    return <FileManagerContext.Provider value={props.fileManager}>{props.children}</FileManagerContext.Provider>;
}

export function useFileManager(): FileManager {
    const result = React.useContext(FileManagerContext);
    if (!result) throw new Error("useFileManager must be used within a FileManagerProvider");
    return result;
}