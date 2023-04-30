export interface FileSimpleChange {
    path?: string;
}

export interface FileRename {
    from?: string;
    to?: string;
}

export interface FileChangeEvent {
    Create?: FileSimpleChange,
    Delete?: FileSimpleChange,
    Modify?: FileSimpleChange,
    RenameBoth?: FileRename,
}

export interface FileData {
    fileType: 'directory' | 'file' | 'unknown';
    path?: string;
    name?: string;
    parentDir?: string;
    extension?: string;
}

export interface FileQueryCommand {
    command: 'root' | 'path';
    path?: string,
}

export interface FileQueryResponse {
    data: FileData;
}

export interface DirectoryQueryResponse {
    data: FileData;
    entires: FileData[];
}

export interface FileQueryResponse {
    directory?: DirectoryQueryResponse,
    file?: FileQueryResponse,
}