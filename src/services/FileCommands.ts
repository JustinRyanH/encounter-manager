import { invoke } from '@tauri-apps/api';
import { FsCommand as FsQueryCommand, FsQueryResponse } from '~/BackendTypes';

export function getRootCommand(): FsQueryCommand {
    return { command: 'queryRoot' };
}

export function getPathCommand(path: string): FsQueryCommand {
    return { command: 'queryPath', path };
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