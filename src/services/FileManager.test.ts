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

const rootMockDirectoryWithEntries = {
    directory: {
        data: {
            fileType: 'directory',
            name: 'root',
            path: '/',
        },
        entries: [mockFileOne]
    }
};

const rootMockDirectoryWithoutEntries = {
    directory: {
        data: {
            fileType: 'directory',
            name: 'root',
            path: '/',
        },
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
});