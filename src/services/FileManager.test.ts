import { describe, test, vi, Mock, expect } from 'vitest';

import { TauriFileManager } from '~/services/FileManager';
import { queryRootDirectory } from '~/services/FileCommands';

vi.mock('~/services/FileCommands');

const rootMockDirectoryWithEntries = {
    directory: {
        data: {
            fileType: 'directory',
            name: 'root',
            path: '/',
        },
        entries: [{
            fileType: 'file',
            name: 'file1',
            path: '/file1',
        }]
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
});