import { Directory, File } from "~/services/FileManager";
import { useFileManager } from "~/components/files/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import React from "react";
import { notifyErrors } from "~/services/notifications";
import { ActionIcon, Button, Group, Menu, Modal, rem, TextInput, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    DotsThreeOutlineVertical,
    FilePlus,
    FolderSimplePlus,
    PencilSimpleLine,
    TrashSimple
} from "@phosphor-icons/react";

interface Modal {
    opened: boolean,
    onClose: () => void
}

interface DirectoryModal extends Modal {
    directory: Directory
}

interface FileModal extends Modal {
    file: File
}

function CreateFileModal({ directory, onClose, opened }: DirectoryModal) {
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

function RenameFileModal({ file, onClose, opened }: FileModal) {
    const fileManager = useFileManager();
    const name = useWatchValueObserver(file.nameObserver);
    const [value, setValue] = React.useState('');
    React.useEffect(() => setValue(name), [opened]);

    const handleSave = () => fileManager.renameFile(file, value)
        .then(() => onClose())
        .catch(e => {
            notifyErrors({ errors: e.toString() });
            onClose();
        });

    return (<Modal opened={opened} onClose={onClose} size="xs" title={`Rename file "${name}"`} centered>
        <Group noWrap m={rem(4)}>
            <TextInput
                data-autofocus
                placeholder="File Name"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                withAsterisk
            />
            <Button onClick={handleSave} variant="light" color="blue">Rename</Button>
        </Group>
    </Modal>)
}

function DeleteConfirmationModal({ file, onClose, opened } : FileModal) {
    const fileManager = useFileManager();
    const name = useWatchValueObserver(file.nameObserver);
    const handleDelete = () => fileManager.deleteFile(file)
        .then(() => onClose())
        .catch(e => {
            notifyErrors({ errors: e.toString() });
            onClose();
        });

    return (<Modal opened={opened} onClose={onClose} size="xs" title={`Delete file "${name}"`} centered>
        <Stack spacing="xl">
            <Text>Do you want to Delete {name}</Text>
            <Group position="right" noWrap m={rem(4)}>
                <Button onClick={onClose} variant="light" color="gray">Cancel</Button>
                <Button onClick={handleDelete} variant="light" color="red">Delete</Button>
            </Group>
        </Stack>
    </Modal>);
}

function CreateDirectoryModal({ directory, onClose, opened }: DirectoryModal) {
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
    const [fileDeleteModal, fileDeleteHandles] = useDisclosure(false);
    const [fileRenameModal, fileRenameHandles] = useDisclosure(false);

    return (<>
        <CreateFileModal directory={directory} onClose={createFileHandles.close} opened={createFileModal}/>
        <CreateDirectoryModal directory={directory} onClose={createDirectoryHandles.close}
                              opened={createDirectoryModal}/>
        <DeleteConfirmationModal file={directory} onClose={fileDeleteHandles.close} opened={fileDeleteModal}/>
        <RenameFileModal file={directory} onClose={fileRenameHandles.close} opened={fileRenameModal}/>
        <Menu position="left" withArrow>
            <Menu.Target>
                <ActionIcon size="xs">
                    <DotsThreeOutlineVertical/>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Directory Actions</Menu.Label>
                <Menu.Item onClick={fileRenameHandles.open} icon={<PencilSimpleLine/>}>Rename Directory</Menu.Item>
                <Menu.Item onClick={fileDeleteHandles.open} icon={<TrashSimple/>}>Delete Directory</Menu.Item>
                <Menu.Item onClick={createDirectoryHandles.open} icon={<FolderSimplePlus/>}>Create Directory</Menu.Item>
                <Menu.Divider/>
                <Menu.Item onClick={createFileHandles.open} icon={<FilePlus/>}>Create File</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>)
}