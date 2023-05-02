import { describe, test, vi, Mock, expect } from 'vitest';

import { Directory, File, TauriFileManager } from '~/services/FileManager';
import { queryRootDirectory, queryPath } from '~/services/FileCommands';

vi.mock('~/services/FileCommands');


const mockFileOne = {
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

const mockFileThree = {
    fileType: 'file',
    name: 'file3',
    path: '/directory1/file3',
    parentDir: '/directory1',
}

const mockDirectoryOne = {
    fileType: 'directory',
    name: 'directory1',
    path: '/directory1',
    parentDir: '/',
}

const mockRootDirectory = {
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

    describe('renameFile', () => {
        test('renames a file', async () => {
            (queryRootDirectory as Mock)
                .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
            (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

            const rootDirectory = new TauriFileManager();
            await rootDirectory.loadRootDirectory();

            expect(rootDirectory.findFile('/directory1/file3')).not.toBeNull();

            rootDirectory.renameFile({ from: '/directory1/file3', to: '/directory1/file4', newName: 'file 4' });
        });
    });

    describe('removeFile', () => {
        test('removes the given file and all of its children', async () => {
            (queryRootDirectory as Mock)
                .mockResolvedValue({ directory: { data: mockRootDirectory, entries: [mockFileOne, mockDirectoryOne] } });
            (queryPath as Mock).mockResolvedValue({ directory: { data: mockDirectoryOne, entries: [mockFileThree] } });

            const rootDirectory = new TauriFileManager();
            await rootDirectory.loadRootDirectory();

            expect(rootDirectory.findFile('/directory1/file3')).not.toBeNull();
            expect(rootDirectory.findFile('/directory1')).not.toBeNull();

            rootDirectory.removeFile({ path: '/directory1' });

            expect(rootDirectory.findFile('/directory1')).toBeNull();
            expect(rootDirectory.findFile('/directory1/file3')).toBeNull();
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