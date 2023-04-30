import React from "react";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { FolderNotch, Plus } from '@phosphor-icons/react';

import { useFileManager } from "~/components/FileManager";
import { Directory } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";


function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    return (<Flex px="xs" wrap="nowrap" align="center" justify="space-between" >
        <FolderNotch />
        <Text size="sm">{name}</Text>
        <Button px="xs" size="xs" variant="subtle" color="gray" disabled={!files.length}>
            <Plus />
        </Button>
    </Flex>)
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