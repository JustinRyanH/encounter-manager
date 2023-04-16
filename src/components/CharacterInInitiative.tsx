import React from "react";
import { Divider, Flex, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { HitPoints } from "~/services/HitPoints";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

/**
 * Returns a random integer between min (inclusive) and max (inclusive). 
 * @param min 
 * @param max 
 * @returns 
 */
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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

function HpAttribute({ hp }: { hp: HitPoints }): JSX.Element {
    const [current] = useWatchValueObserver(hp.currentObserver);
    const [max] = useWatchValueObserver(hp.totalObserver);
    const [temporary] = useWatchValueObserver(hp.tempObserver);

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
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 25, hp: randomRange(7, 15) }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="center">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <NameAttribute name={character.name} />
                <InitiativeAttribute initiative={character.initiative} />
                <HpAttribute hp={character.hp} />
            </Flex>
        </Paper>
    );
}
