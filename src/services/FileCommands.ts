import { invoke } from '@tauri-apps/api';
import { FsCommand as FsQueryCommand, FsQueryResponse } from '~/BackendTypes';

export function getRootCommand(): FsQueryCommand {
    return { queryRoot: null };
}

export function getPathCommand(path: string): FsQueryCommand {
    return { queryPath: { path } };
}

export function touchCommand(parentDir: string, name: string): FsQueryCommand {
    return { touchFile: { parentDir, name } };
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

export function touchFile(parentDir: string, fileName: string): Promise<FsQueryResponse> {
    return queryFileSystem(touchCommand(parentDir, fileName));
}