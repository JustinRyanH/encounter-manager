import React from "react";
import { ActionIcon, Flex, Popover, Text, TextInput, UnstyledButton } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

import { ValueObserver } from "~/services/ValueObserver";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { useDisclosure } from "@mantine/hooks";


export function NameAttribute({observer}: { observer: ValueObserver<string> }): JSX.Element {
    const [opened, openedHandles] = useDisclosure(false);
    const name = useWatchValueObserver(observer.readonly);
    const [newName, setNewName] = React.useState('');
    const handleSetNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    }
    const commitNewName = () => {
        if (newName !== '') {
            setNewName('');
        }
        openedHandles.close();
    }

    return (
        <Popover position="right" opened={opened} withArrow>
            <Popover.Target>
                <UnstyledButton onClick={openedHandles.toggle}>
                    <Attribute title="NAME">
                        <Text size="sm">{name}</Text>
                    </Attribute>

                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
                <Flex align="center" gap="xs">
                    <TextInput placeholder="Update Character Name" value={newName} onChange={handleSetNewName} />
                    <ActionIcon title="Commit" onClick={commitNewName}>
                        <IconCheck size="1.75rem" />
                    </ActionIcon>
                </Flex>
            </Popover.Dropdown>
        </Popover>
    );
}