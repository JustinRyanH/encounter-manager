import { ActionIcon, Group, Header } from '@mantine/core';
import { BugBeetle } from '@phosphor-icons/react';

export function AppHeader() {
    return (<Header p="xs" height={{ base: '3rem', md: '4rem' }}>
        <Group position="right">
            <ActionIcon title="Debug Panel" variant="outline">
                <BugBeetle />
            </ActionIcon>
        </Group>
    </Header>)
}