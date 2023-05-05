import React from "react";
import {
    Modal,
    ActionIcon,
    Collapse,
    Divider,
    Flex,
    Menu,
    ScrollArea,
    Stack,
    Text,
    UnstyledButton,
    rem,
    TextInput,
    Group,
    Button
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    DotsThreeOutlineVertical,
    File as FileIcon,
    FilePlus,
    FolderNotch,
    FolderSimplePlus,
    PencilSimpleLine,
    TrashSimple
} from '@phosphor-icons/react';

import { useFileManager } from "~/components/files/FileManager";
import { Directory, File } from "~/services/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { notifyErrors } from "~/services/notifications";

function FileLine({ file }: { file: File }) {
    const name = useWatchValueObserver(file.nameObserver);
    return (<Flex gap="0" justify="flex-start" align="center" wrap="nowrap">
        <FileIcon style={{ marginRight: rem(4) }}/>
        <Text size="xs">{name}</Text>
    </Flex>)
}

function CreateFileModal({ directory, onClose, opened }: {
    directory: Directory,
    onClose: () => void,
    opened: boolean
}) {
    const fileManager = useFileManager();
    const name = useWatchValueObserver(directory.nameObserver);
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(''), [opened]);

    const handleSave = () => fileManager.touchFile(directory, value)
        .then(() => onClose())
        .catch(e => {
            notifyErrors({ errors: e.toString() });
            onClose();
        });

    return (<Modal opened={opened} onClose={onClose} size="xs" title={`Create file in "${name}"`} centered>
        <Group noWrap m={rem(4)}>
            <TextInput
                data-autofocus
                placeholder="File Name"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                withAsterisk
            />
            <Button onClick={handleSave} variant="light" color="blue">Create</Button>
        </Group>
    </Modal>)
}

function CreateDirectoryModal({ directory, onClose, opened }: {
    directory: Directory,
    onClose: () => void,
    opened: boolean
}) {
    const fileManager = useFileManager();
    const name = useWatchValueObserver(directory.nameObserver);
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(''), [opened]);

    const handleSave = () => fileManager.touchDirectory(directory, value)
        .then(() => onClose())
        .catch(e => {
            notifyErrors({ errors: e.toString() });
            onClose();
        });

    return (<Modal opened={opened} onClose={onClose} size="xs" title={`Create directory in "${name}"`} centered>
        <Group noWrap m={rem(4)}>
            <TextInput
                data-autofocus
                placeholder="Directory Name"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                withAsterisk
            />
            <Button onClick={handleSave} variant="light" color="blue">Create</Button>
        </Group>
    </Modal>)
}

function DirectoryMenu({ directory }: { directory: Directory }) {
    const [createFileModal, createFileHandles] = useDisclosure(false);
    const [createDirectoryModal, createDirectoryHandles] = useDisclosure(false);

    return (<>
        <CreateFileModal directory={directory} onClose={createFileHandles.close} opened={createFileModal}/>
        <CreateDirectoryModal directory={directory} onClose={createDirectoryHandles.close} opened={createDirectoryModal} />
        <Menu position="left" withArrow>
            <Menu.Target>
                <ActionIcon size="xs">
                    <DotsThreeOutlineVertical/>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>File Actions</Menu.Label>
                <Menu.Item icon={<PencilSimpleLine/>}>Rename Directory</Menu.Item>
                <Menu.Item icon={<TrashSimple/>}>Delete Directory</Menu.Item>
                <Menu.Item onClick={createDirectoryHandles.open} icon={<FolderSimplePlus/>}>Create Directory</Menu.Item>
                <Menu.Divider/>
                <Menu.Item onClick={createFileHandles.open} icon={<FilePlus/>}>Create File</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>)
}


function DirectoryLine({ directory }: { directory: Directory }) {
    const name = useWatchValueObserver(directory.nameObserver);
    const files = useWatchValueObserver(directory.filesObserver);
    const hasFiles = !!files.length;
    const [opened, { toggle }] = useDisclosure();

    const fileComponents = files.map((file) => {
        if (file.type === 'directory') return <DirectoryLine key={file.path} directory={file as Directory}/>;
        return <FileLine key={file.path} file={file}/>;
    });

    const fileList = (<>
        <Divider/>
        <Collapse pl={rem(8)} in={opened} transitionDuration={200} transitionTimingFunction="ease-in">
            <Stack spacing={rem(2)}>
                {fileComponents}
            </Stack>
        </Collapse>
    </>);


    return (<>
        <Flex gap="0" justify="space-between" align="center" wrap="nowrap">
            <FolderNotch style={{ minWidth: "1rem", marginRight: rem(4) }}/>
            <UnstyledButton onClick={toggle}
                            style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Text style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} size="xs">{name}</Text>
            </UnstyledButton>
            <DirectoryMenu directory={directory}/>
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
                {rootDirectory && <DirectoryLine directory={rootDirectory}/>}
            </Stack>
        </ScrollArea>
    )
}