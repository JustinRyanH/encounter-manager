export interface FileData {
    fileType: 'directory' | 'file' | 'unknown';
    path: string;
    name: string;
    parentDir?: string;
    extension?: string;
}

export type FileSimpleChange = FileData;

export interface FileRename {
    from?: string;
    to?: string;
}

export interface FileChangeEvent {
    create?: FileSimpleChange,
    delete?: FileSimpleChange,
    modify?: FileSimpleChange,
    renameBoth?: FileRename,
}

export interface FsQueryCommmand {
    command: 'root' | 'path';
    path?: string,
}

export interface FileQueryResponse {
    data: FileData;
}

export interface DirectoryQueryResponse {
    data: FileData;
    entries: FileData[];
}

export interface FsQueryResponse {
    directory?: DirectoryQueryResponse,
    file?: FileQueryResponse,
}