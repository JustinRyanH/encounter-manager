import React from "react";
import { Collapse, Divider, Flex, ScrollArea, Stack, Text, UnstyledButton, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { File as FileIcon, FolderNotch, Plus } from '@phosphor-icons/react';

import { useFileManager } from "~/components/FileManager";
import { Directory, File } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

function FileLine({ file }: { file: File }) {
    const name = useWatchValueObserver(file.nameObserver);
    return (<Flex gap="xs" justify="flex-start" align="center" wrap="nowrap">
        <FileIcon />
        <Text size="sm">{name}</Text>
    </Flex>)
}


function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    const hasFiles = !!files.length;
    const [opened, { toggle }] = useDisclosure();

    const fileComponents = files.map((file) => {
        if (file.type === 'directory') return <DirectoryLine key={file.path} directory={file as Directory} />;
        return <FileLine key={file.path} file={file} />;
    });

    const fileList = (<>
        <Divider />
        <Collapse pl={rem(8)} in={opened} transitionDuration={100} transitionTimingFunction="linear">
            <Stack spacing={rem(4)}>
                {fileComponents}
            </Stack>
        </Collapse>
    </>);


    return (<>
        <UnstyledButton onClick={toggle} disabled={!hasFiles}>
            <Flex gap="xs" justify="space-between" align="center" wrap="nowrap">
                <FolderNotch style={{ minWidth: "1rem" }} />
                <Text style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', flexGrow: 1, overflow: 'hidden' }} size="sm">{name}</Text>
                {hasFiles && <Plus onClick={toggle} />}
            </Flex>
        </UnstyledButton>
        {hasFiles && fileList}
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

    return <Stack spacing={rem(4)}>
        <ScrollArea h={200} offsetScrollbars scrollbarSize={2}>
            {rootDirectory && <DirectoryLine directory={rootDirectory} />}
        </ScrollArea>
    </Stack>
}