import React from "react";
import { ActionIcon, Flex, FocusTrap, Popover, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { InitiativeCharacter } from "~/services/InititativeCharacter";


export function NameAttribute({character}: { character: InitiativeCharacter }): JSX.Element {
    const [opened, openedHandles] = useDisclosure(false);
    const name = useWatchValueObserver(character.nameObserver.readonly);
    const [newName, setNewName] = React.useState('');
    const handleSetNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    }
    const commitNewName = () => {
        if (newName !== '') {
            character.name = newName;
            setNewName('');
        }
        openedHandles.close();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            commitNewName();
        }
    }

    return (
        <Popover
            position="right"
            opened={opened}
            withArrow
            trapFocus
            returnFocus
        >
            <Popover.Target>
                <UnstyledButton onClick={openedHandles.toggle}>
                    <Attribute title="NAME">
                        <Text size="sm">{name}</Text>
                    </Attribute>
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
                <Flex align="center" gap="xs">
                    <TextInput onKeyDown={handleKeyDown} placeholder="Update Character Name" value={newName} onChange={handleSetNewName} />
                    <ActionIcon title="Commit" onClick={commitNewName}>
                        <IconCheck size="1.75rem" />
                    </ActionIcon>
                </Flex>
            </Popover.Dropdown>
        </Popover>
    );
}