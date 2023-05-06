import React from "react";
import { Collapse, Divider, Flex, Group, rem, ScrollArea, Stack, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { File as FileIcon, FolderNotch } from '@phosphor-icons/react';

import { useFileManager } from "~/components/files/FileManager";
import { Directory, File } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { DirectoryMenu, FileMenu } from "~/components/files/DirectoryMenu";

function FileLine({ file }: { file: File }) {
    const name = useWatchValueObserver(file.nameObserver);
    return (<Group position="apart">
        <Flex gap="0" justify="flex-start" align="center" wrap="nowrap">
            <FileIcon style={{ marginRight: rem(4) }} />
            <Text size="xs">{name}</Text>
        </Flex>
        <FileMenu file={file} />
    </Group>)
}


function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    const hasFiles = !!files.length;
    const [opened, { toggle }] = useDisclosure();
    const [menuOpened, menuHandles] = useDisclosure(false);

    const fileComponents = files.map((file) => {
        if (file.type === 'directory') return <DirectoryLine key={file.path} directory={file as Directory} />;
        return <FileLine key={file.path} file={file} />;
    });

    const fileList = (<>
        <Divider />
        <Collapse pl={rem(8)} in={opened} transitionDuration={200} transitionTimingFunction="ease-in">
            <Stack spacing={rem(2)}>
                {fileComponents}
            </Stack>
        </Collapse>
    </>);

    const onContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        menuHandles.open();
    };


    return (<>
        <Flex gap="0" justify="space-between" align="center" wrap="nowrap">
            <FolderNotch style={{ minWidth: "1rem", marginRight: rem(4) }} />
            <UnstyledButton
                onClick={toggle}
                onContextMenu={onContextMenu}
                style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
                <Text style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} size="xs">{name}</Text>
            </UnstyledButton>
            <DirectoryMenu directory={directory} opened={menuOpened} onClose={menuHandles.close} onOpen={menuHandles.open} />
        </Flex>
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

    return (
        <ScrollArea h={200} offsetScrollbars scrollbarSize={2}>
            <Stack spacing={rem(2)} w="12.5rem">
                {rootDirectory && <DirectoryLine directory={rootDirectory} />}
            </Stack>
        </ScrollArea>
    )
}