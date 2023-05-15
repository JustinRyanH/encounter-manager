// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
    interface Window {
        __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
    }
}

const invoke = window.__TAURI_INVOKE__;

export function queryFileSystem(command: FsCommand) {
    return invoke<QueryCommandResponse | null>("query_file_system", { command })
}

export function notifyFileChange(event: FileChangeEvent) {
    return invoke<null>("notify_file_change", { event })
}

export type DirectoryResponse = { data: FileData; entries: FileData[] }
export type FileChangeEvent = { create: FileData } | { delete: FileData } | { modify: FileData } | { renameAny: { path: string } } | { rename: { from: string; to: string; data: FileData } }
export type FileResponse = { data: FileData }
export type FileData = { fileType: FileType; name: string; parentDir: string | null; extension: string | null; path: string }
export type FsCommand = "queryRoot" | { queryPath: { path: string } } | { touchFile: TouchCommand } | { touchDirectory: TouchCommand } | { deletePath: { path: string } } | { renamePath: { from: string; to: string } }
export type TouchCommand = { parentDir: string; name: string }
export type FileType = "directory" | "file" | "unknown"
export type QueryCommandResponse = { directory: DirectoryResponse } | { file: FileResponse }
