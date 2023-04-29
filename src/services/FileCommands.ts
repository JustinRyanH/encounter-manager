import { invoke } from '@tauri-apps/api';
import { FileQueryCommand, FileQueryResponse } from '~/BackendTypes';

export function getRootCommand(): FileQueryCommand {
    return { command: 'root' };
}

export function getPathCommand(path: string): FileQueryCommand {
    return { command: 'path', path };
}

async function queryFileSystem(command: FileQueryCommand): Promise<FileQueryResponse> {
    return await invoke('query_file_system', { command });
}

export function queryRootDirectory(): Promise<FileQueryResponse> {
    return queryFileSystem(getRootCommand());
}

export function queryPath(path: string): Promise<FileQueryResponse> {
    return queryFileSystem(getPathCommand(path));
}