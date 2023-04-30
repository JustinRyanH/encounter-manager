import { invoke } from '@tauri-apps/api';
import { FsQueryCommmand as FsQueryCommand, FsQueryResponse } from '~/BackendTypes';

export function getRootCommand(): FsQueryCommand {
    return { command: 'root' };
}

export function getPathCommand(path: string): FsQueryCommand {
    return { command: 'path', path };
}

async function queryFileSystem(command: FsQueryCommand): Promise<FsQueryResponse> {
    return await invoke('query_file_system', { command });
}

export function queryRootDirectory(): Promise<FsQueryResponse> {
    return queryFileSystem(getRootCommand());
}

export function queryPath(path: string): Promise<FsQueryResponse> {
    return queryFileSystem(getPathCommand(path));
}