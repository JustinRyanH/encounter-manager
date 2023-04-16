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

function HpAttribute({ current, max, temporary }: { current: number, max: number, temporary: number }): JSX.Element {
    return (
        <Attribute title="HIT POINTS">
            <Text>{current + temporary}</Text>
            <Text>/</Text>
            <Text>{max}</Text>
        </Attribute>
    );
}

function NameAttribute({ name }: { name: string }): JSX.Element {
    return (
        <Attribute title="NAME">
            <Text>{name}</Text>
        </Attribute>
    );
}

function InitiativeAttribute({ initiative }: { initiative: number }) {
    return (
        <Attribute title="INITIATIVE">
            <Text>{initiative}</Text>
        </Attribute>
    );
}


export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 25 }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="center">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <NameAttribute name={character.name} />
                <InitiativeAttribute initiative={character.initiative} />
                <HpAttribute current={4} max={10} temporary={4} />
            </Flex>
        </Paper>
    );
}
