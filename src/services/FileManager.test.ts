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
        expect(root.files.length).toEqual(1);
    });
});