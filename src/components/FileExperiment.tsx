import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { File as FileIcon, FolderNotch, Plus } from '@phosphor-icons/react';

import { useFileManager } from "~/components/FileManager";
import { Directory, File } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";


function FileLine({ file, spacing }: { file: File, spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '' }) {
    const name = useWatchValueObserver(file.nameObserver);
    return (<Group>
        <FileIcon />
        <Text pl={spacing} size="sm">{name}</Text>
    </Group>)
}

function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    return (<>
        <Group position="apart">
            <Group position="left">
                <FolderNotch />
                <Text size="sm">{name}</Text>
            </Group>
            <Button px="xs" size="xs" variant="subtle" color="gray" disabled={!files.length}>
                <Plus />
            </Button>
        </Group>
        {files.map((file) => <FileLine key={file.path} file={file} spacing="xs" />)}
    </>);
}

export function FileExperiment() {
    const fileManager = useFileManager();
    React.useEffect(() => {
        const loadFiles = async () => {
            await fileManager.startWatching();
            await fileManager.loadRootDirectory();
        };
        loadFiles();
    }, [fileManager]);

    const rootDirectory = useWatchValueObserver(fileManager.rootDirectoryObserver);

    return <Stack>
        {rootDirectory && <DirectoryLine directory={rootDirectory} />}
    </Stack>
}