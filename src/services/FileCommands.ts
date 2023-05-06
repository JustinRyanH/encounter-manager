import { invoke } from '@tauri-apps/api';
import { FsCommand as FsQueryCommand, FsQueryResponse } from '~/BackendTypes';

export function getRootCommand(): FsQueryCommand {
    return { queryRoot: null };
}

export function getPathCommand(path: string): FsQueryCommand {
    return { queryPath: { path } };
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
    return queryFileSystem({ touchFile: { parentDir, name: fileName } });
}

export function touchDirectory(parentDir: string, dirName: string): Promise<FsQueryResponse> {
    return queryFileSystem({ touchDirectory: { parentDir, name: dirName } });
}

export function deletePath(path: string): Promise<FsQueryResponse> {
    return queryFileSystem({ deletePath: { path } });
}

export function renamePath(from: string, to: string): Promise<FsQueryResponse> {
    return queryFileSystem({ renamePath: { from, to } });
}