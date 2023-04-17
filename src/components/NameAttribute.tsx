import React from "react";
import { ActionIcon, Flex, Popover, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { InitiativeCharacter } from "~/services/InititativeCharacter";


function NameAttributeEdit({ character, handles }: { character: InitiativeCharacter, handles: { readonly close: () => void } }): JSX.Element {
    const ref = React.useRef<HTMLDivElement>(null);
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

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) {
            handles.close();
        }
    }

    return <Flex ref={ref} align="center" gap="xs">
        <TextInput onKeyDown={handleKeyDown} placeholder="Update Character Name" value={newName} onChange={handleSetNewName} onBlur={handleBlur} />
        <ActionIcon title="Commit" onClick={commitNewName} onBlur={handleBlur}>
            <IconCheck size="1.75rem" />
        </ActionIcon>
    </Flex>;
}


export function NameAttribute({ character }: { character: InitiativeCharacter }): JSX.Element {
    const [opened, openedHandles] = useDisclosure(false);
    const name = useWatchValueObserver(character.nameObserver.readonly);

    return (
        <Popover
            position="top"
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
                <NameAttributeEdit character={character} handles={openedHandles} />
            </Popover.Dropdown>
        </Popover>
    );
}