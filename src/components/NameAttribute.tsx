import React from "react";
import { ActionIcon, Flex, Popover, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useClickOutside, useDisclosure } from "@mantine/hooks";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { InitiativeCharacter } from "~/services/InititativeCharacter";


export interface DisclousreHandles {
    readonly close: () => void;
}

function NameAttributeEdit({ character, handles }: { character: InitiativeCharacter, handles: DisclousreHandles }): JSX.Element {
    const [newName, setNewName] = React.useState('');
    const handleSetNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    }
    const commitNewName = () => {
        if (newName !== '') {
            character.name = newName;
            setNewName('');
        }
        handles.close();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handles.close();
            return;
        }
        if (e.key === 'Enter') {
            commitNewName();
        }
    }

    const ref = useClickOutside(() => handles.close(), ['mousedown', 'touchstart']);

    return <Flex ref={ref} align="center" gap="xs">
        <TextInput onKeyDown={handleKeyDown} placeholder="Update Character Name" value={newName} onChange={handleSetNewName} />
        <ActionIcon title="Commit" onClick={commitNewName}>
            <IconCheck size="1.75rem" />
        </ActionIcon>
    </Flex>;
}


export function NameAttribute({ character }: { character: InitiativeCharacter }): JSX.Element {
    const [opened, openedHandles] = useDisclosure(false);
    const name = useWatchValueObserver(character.nameObserver.readonly);

    return (
        <Attribute title="NAME">
            <Popover
                position="top"
                opened={opened}
                withArrow
                trapFocus
                returnFocus
            >
                <Popover.Target>
                    <UnstyledButton onClick={openedHandles.toggle}>
                        <Text size="sm">{name}</Text>
                    </UnstyledButton>
                </Popover.Target>
                <Popover.Dropdown>
                    <NameAttributeEdit character={character} handles={openedHandles} />
                </Popover.Dropdown>
            </Popover>
        </Attribute>
    );
}