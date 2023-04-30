import { describe, test, vi, Mock } from 'vitest';

import { TauriFileManager } from '~/services/FileManager';
import { queryRootDirectory } from '~/services/FileCommands'; { }

vi.mock('~/services/FileCommands');

describe('FileManager', () => {
    test('load the root Directory', async () => {

        (queryRootDirectory as Mock).mockResolvedValue({
            directory: {
                data: {
                    fileType: 'directory',
                    name: 'root',
                    path: '/',
                },
                entires: []
            }
        });
        const rootDirectory = new TauriFileManager();

        expect(rootDirectory.rootDirectory).toBeNull();

        await rootDirectory.loadRootDirectory();

        const root = rootDirectory.rootDirectory;

        expect(rootDirectory.rootDirectory).not.toBeNull();
    });
});