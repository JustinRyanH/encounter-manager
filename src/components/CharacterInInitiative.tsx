import React from "react";
import { Divider, Flex, NumberInput, Paper, Skeleton, Stack, Text, TextInput, Title, rem } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";

function HitPoints({ current, max, temporary }: { current: number, max: number, temporary: number }) {
    return (
        <Paper withBorder p="xs">
            <Stack>
                <Title size="sm">HIT POINTS</Title>
                <Divider />
                <Flex justify="center" gap="sm">
                    <Text>{current + temporary}</Text>
                    <Text>/</Text>
                    <Text>{max}</Text>
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
                <TextInput styles={{ input: { textAlign: "center" } }} value={character.name} readOnly />
                <NumberInput style={{ width: rem(50) }} value={character.initiative} hideControls />
                <HitPoints current={4} max={10} temporary={4} />
            </Flex>
        </Paper>
    );
}
