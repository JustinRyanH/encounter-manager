import React from "react";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { File as FileIcon, FolderNotch, Plus } from '@phosphor-icons/react';

import { useFileManager } from "~/components/FileManager";
import { Directory, File } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";


function FileLine({ file, spacing }: { file: File, spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '' }) {
    const name = useWatchValueObserver(file.nameObserver);
    return (<Flex gap="xs" justify="flex-start" align="center" wrap="nowrap">
        <FileIcon />
        <Text pl={spacing} size="sm">{name}</Text>
    </Flex>)
}

function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    return (<>
        <Flex gap="xs" justify="space-between" align="center" wrap="nowrap">
            <FolderNotch style={{ minWidth: "1rem" }} />
            <Text style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', flexGrow: 1, overflow: 'hidden' }} size="sm">{name}</Text>
            <Button px="xs" size="xs" variant="subtle" color="gray" disabled={!files.length}>
                <Plus />
            </Button>
        </Flex>
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