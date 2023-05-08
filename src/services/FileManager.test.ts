import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';
import { listen } from "@tauri-apps/api/event";

import { Directory, File, TauriFileManager } from '~/services/FileManager';
import { queryPath, queryRootDirectory } from '~/services/FileCommands';
import { FileChangeEvent, FileData } from "~/FilenameTypes";

vi.mock('@tauri-apps/api/event');
vi.mock('~/services/FileCommands');

interface FakeEvent<T> {
    payload: T;
}

const mockFileOne: FileData = {
    fileType: 'file',
    name: 'file1',
    path: '/file1',
    parentDir: '/',
}

const mockFileTwo = {
    fileType: 'file',
    name: 'file2',
    path: '/file2',
    parentDir: '/',
}

const mockFileThree: FileData = {
    fileType: 'file',
    name: 'file3',
    path: '/directory1/file3',
    parentDir: '/directory1',
}

const mockDirectoryOne: FileData = {
    fileType: 'directory',
    name: 'directory1',
    path: '/directory1',
    parentDir: '/',
}

const mockRootDirectory: FileData = {
    fileType: 'directory',
    name: 'root',
    path: '/',
};

const rootMockDirectoryWithEntries = {
    directory: {
        data: mockRootDirectory,
        entries: [mockFileOne]
    }
};

const rootMockDirectoryWithoutEntries = {
    directory: {
        data: mockRootDirectory,
        entries: []
    }
};

describe('FileManager', () => {
    type PseudoFileChange = (message: FakeEvent<FileChangeEvent>) => void | null;
    let signalFileChange: PseudoFileChange | null = null;

    function CallSignal(message: FakeEvent<FileChangeEvent>) {
        if (!signalFileChange) throw new Error("signalFileChange not set");
        signalFileChange(message);
    }

    beforeEach(() => {
        (listen as Mock).mockImplementation((_, callback) => {
            signalFileChange = callback as PseudoFileChange;
        });
    });

    test('load the root Directory', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithoutEntries);
        const rootDirectory = new TauriFileManager();

        expect(rootDirectory.rootDirectory).toBeNull();

        await rootDirectory.loadRootDirectory();

        const root = rootDirectory.rootDirectory;

        expect(root).not.toBeNull();
        expect(root?.name).toEqual('root');
    });

    test('loads the entries of the root directory', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        const rootDirectory = new TauriFileManager();

        expect(rootDirectory.rootDirectory).toBeNull();

        await rootDirectory.loadRootDirectory();

        const root = rootDirectory.rootDirectory;
        if (!root) throw new Error("Root directory not loaded");
        expect(root.entries.length).toEqual(1);
    });

    test('files and directories are accessible through getFile', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        const rootDirectory = new TauriFileManager();

        expect(rootDirectory.findFile('/')).toBeNull();
        expect(rootDirectory.findFile('/file1')).toBeNull();

        await rootDirectory.loadRootDirectory();

        const root = rootDirectory.findFile('/');
        const file1 = rootDirectory.findFile('/file1');

        expect(root).not.toBeNull();
        expect(file1).not.toBeNull();
    });

    test('files are set to their directory', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        const rootDirectory = new TauriFileManager();
        await rootDirectory.loadRootDirectory();

        const file1 = rootDirectory.findFile('/file1');
        const root = rootDirectory.findFile('/');

        expect(file1?.parent).toEqual(root);
    });

    test('load path loads files, and inserts them into their directory', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        (queryPath as Mock).mockResolvedValue({ file: { data: mockFileTwo } });

        const rootDirectory = new TauriFileManager();
        await rootDirectory.loadRootDirectory();

        const rootDir = rootDirectory.findFile('/') as Directory;
        expect(rootDir).not.toBeNull();
        expect(rootDirectory.findFile('/file1')).not.toBeNull();
        expect(rootDirectory.findFile('/file2')).toBeNull();

        await rootDirectory.loadPath('/file2');

        const fileTwo = rootDirectory.findFile('/file2');
        expect(fileTwo?.name).toEqual('file2');
        expect(rootDir.files.includes(fileTwo as File)).toBeTruthy();
        expect(fileTwo?.parent).toEqual(rootDir);
    });

    test('load path loads directories, and inserts them into their directory', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [] } });

        const rootDirectory = new TauriFileManager();
        await rootDirectory.loadRootDirectory();

        const rootDir = rootDirectory.findFile('/') as Directory;
        expect(rootDir).not.toBeNull();
        expect(rootDirectory.findFile('/file1')).not.toBeNull();
        expect(rootDirectory.findFile('/directory1')).toBeNull();

        await rootDirectory.loadPath('/directory1');

        let directory = rootDirectory.findFile('/directory1');
        expect(directory).not.toBeNull();
        directory = directory as Directory;

        expect(directory?.name).toEqual('directory1');
        expect(rootDir.directories.includes(directory as Directory)).toBeTruthy();
        expect(directory?.parent).toEqual(rootDir);

    });

    test('prevent duplication of files', async () => {
        (queryRootDirectory as Mock)
            .mockResolvedValue(rootMockDirectoryWithEntries);
        (queryPath as Mock).mockResolvedValue({ file: { data: mockFileOne } });

        const rootDirectory = new TauriFileManager();
        await rootDirectory.loadRootDirectory();

        const rootDir = rootDirectory.findFile('/') as Directory;
        expect(rootDir).not.toBeNull();
        expect(rootDirectory.findFile('/file1')).not.toBeNull();

        await rootDirectory.loadPath('/file1');

        expect(rootDir.entries.length).toEqual(1);
    });

    describe('signals', () => {
        describe('signal File Rename', () => {
            const file4: FileData = {
                fileType: 'file',
                name: 'file4',
                path: '/directory1/file4',
                parentDir: '/directory1',
            }
            test('renames a file', async () => {
                (queryRootDirectory as Mock)
                    .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
                (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

                const rootDirectory = new TauriFileManager();
                await rootDirectory.startWatching();
                await rootDirectory.loadRootDirectory();

                expect(rootDirectory.findFile('/directory1/file3')).not.toBeNull();

                CallSignal({ payload: { rename: { from: '/directory1/file3', to: '/directory1/file4', data: file4 } } });
                expect(rootDirectory.findFile('/directory1/file3')).toBeNull();
                expect(rootDirectory.findFile('/directory1/file4')).not.toBeNull();
            });
        });

        describe('signal File Removal', () => {
            test('removes the given file and all of its children', async () => {
                (queryRootDirectory as Mock)
                    .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
                (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

                const rootDirectory = new TauriFileManager();
                await rootDirectory.startWatching();
                await rootDirectory.loadRootDirectory();

                const file1 = rootDirectory.findFile('/directory1/file3');
                const directory1 = rootDirectory.findFile('/directory1');

                expect(file1).not.toBeNull();
                expect(directory1).not.toBeNull();

                CallSignal({ payload: { delete: mockDirectoryOne } });

                expect(rootDirectory.findFile('/directory1')).toBeNull();
                expect(rootDirectory.findFile('/directory1/file3')).toBeNull();
            });

            test('orphans all of the files and directories', async () => {
                (queryRootDirectory as Mock)
                    .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
                (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

                const rootDirectory = new TauriFileManager();
                await rootDirectory.startWatching();
                await rootDirectory.loadRootDirectory();

                const file1 = rootDirectory.findFile('/directory1/file3') as File;
                const directory1 = rootDirectory.findFile('/directory1') as Directory;

                expect(file1).not.toBeNull();
                expect(directory1).not.toBeNull();

                CallSignal({ payload: { delete: mockDirectoryOne } });

                expect(file1.parent).toBeNull();
                expect(directory1.getFileFromPath(file1.path)).toBeNull();
            });
        });

        describe('signal File Create', () => {
            const file4: FileData = {
                fileType: 'file',
                name: 'file4',
                path: '/directory1/file4',
                parentDir: '/directory1',
            }
            test('inserts the file into the path', async () => {
                (queryRootDirectory as Mock)
                    .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
                (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

                const rootDirectory = new TauriFileManager();
                await rootDirectory.startWatching();
                await rootDirectory.loadRootDirectory();

                const file3 = rootDirectory.findFile('/directory1/file3') as File;
                const directory1 = rootDirectory.findFile('/directory1') as Directory;

                expect(file3).not.toBeNull();
                expect(directory1).not.toBeNull();

                CallSignal({ payload: { create: file4 } });

                expect(rootDirectory.findFile('/directory1/file4')).not.toBeNull();
            });
        });
    });
});

describe('Directory', () => {
    test('can return all of the files in the directory', async () => {
        const directory = new Directory({ name: 'root', path: '/' });
        const innerFile = new File({ name: 'file1', path: '/file1' });
        const innerDirectory = new Directory({ name: 'directory1', path: '/directory1' });
        const innerDirectoryFile = new File({ name: 'file2', path: '/directory1/file2' });

        directory.addFile(innerFile);
        directory.addFile(innerDirectory);
        innerDirectory.addFile(innerDirectoryFile);

        expect(directory.allPaths).toEqual(['/', '/file1', '/directory1', '/directory1/file2']);
    });
});