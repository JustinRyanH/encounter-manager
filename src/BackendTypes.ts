export interface FileData {
    fileType: 'directory' | 'file' | 'unknown';
    path: string;
    name: string;
    parentDir?: string;
    extension?: string;
}

export type FileSimpleChange = FileData;

export interface FileRename {
    from: string;
    to: string;
    data: FileData;
}

export interface FileChangeEvent {
    create?: FileSimpleChange,
    delete?: FileSimpleChange,
    modify?: FileSimpleChange,
    rename?: FileRename,
}

export interface QueryPath {
    path: string;
}

export interface TouchFile {
    parentDir: string;
    fileName: string;
}

export interface FsCommand {
    queryRoot?: null;
    queryPath?: QueryPath;
    touchFile?: TouchFile;
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