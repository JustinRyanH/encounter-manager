import { Directory } from "~/services/FileManager";
import { useFileManager } from "~/components/files/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import React from "react";
import { notifyErrors } from "~/services/notifications";
import { ActionIcon, Button, Group, Menu, Modal, rem, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    DotsThreeOutlineVertical,
    FilePlus,
    FolderSimplePlus,
    PencilSimpleLine,
    TrashSimple
} from "@phosphor-icons/react";

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

export function DirectoryMenu({ directory }: { directory: Directory }) {
    const [createFileModal, createFileHandles] = useDisclosure(false);
    const [createDirectoryModal, createDirectoryHandles] = useDisclosure(false);

    return (<>
        <CreateFileModal directory={directory} onClose={createFileHandles.close} opened={createFileModal}/>
        <CreateDirectoryModal directory={directory} onClose={createDirectoryHandles.close}
                              opened={createDirectoryModal}/>
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