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