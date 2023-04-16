import React from "react";
import { Divider, Flex, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";

function Attribute({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Paper withBorder p="xs">
            <Stack>
                <Title size="sm" align="center">{title}</Title>
                <Divider />
                <Flex justify="center" gap="sm">
                    {children}
                </Flex>
            </Stack>
        </Paper>
    );
}

function HitPoints({ current, max, temporary }: { current: number, max: number, temporary: number }) {
    return (
        <Attribute title="HIT POINTS">
            <Text>{current + temporary}</Text>
            <Text>/</Text>
            <Text>{max}</Text>
        </Attribute>
    );
}

function Name({ name }: { name: string }) {
    return (
        <Paper withBorder p="xs">
            <Stack>
                <Title size="sm">NAME</Title>
                <Divider />
                <Flex justify="center" gap="sm">
                    <Text>{name}</Text>
                </Flex>
            </Stack>
        </Paper>
    );
}

function Initiative({ initiative }: { initiative: number }) {
    return (
        <Paper withBorder p="xs">
            <Stack>
                <Title size="sm">INITIATIVE</Title>
                <Divider />
                <Flex justify="center" gap="sm">
                    <Text>{initiative}</Text>
                </Flex>
            </Stack>
        </Paper>
    );
}


export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 25 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="center">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <Name name={character.name} />
                <Initiative initiative={character.initiative} />
                <HitPoints current={4} max={10} temporary={4} />
            </Flex>
        </Paper>
    );
}
