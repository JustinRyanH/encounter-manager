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
    type: 'directory' | 'file';
    data: FileData;
    entries?: FileData[];
}