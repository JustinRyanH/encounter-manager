import React from "react";
import { Divider, Flex, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { HitPoints } from "~/services/HitPoints";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { ValueObserver } from "~/services/ValueObserver";

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
    const current = useWatchValueObserver(hp.currentObserver.readonly);
    const total = useWatchValueObserver(hp.totalObserver.readonly);
    const temporary = useWatchValueObserver(hp.tempObserver.readonly);

    return (
        <Attribute title="HIT POINTS">
            <Text size="sm">{current + temporary}</Text>
            <Text size="sm">/</Text>
            <Text size="sm">{total}</Text>
            <Divider orientation="vertical" />
            <Text>--</Text>
        </Attribute>
    );
}

function NameAttribute({ observer }: { observer: ValueObserver<string> }): JSX.Element {
    const name = useWatchValueObserver(observer.readonly);
    return (
        <Attribute title="NAME">
            <Text size="sm">{name}</Text>
        </Attribute>
    );
}

function InitiativeAttribute({ observer }: { observer: ValueObserver<number> }) {
    const initiative = useWatchValueObserver(observer.readonly);

    return (
        <Attribute title="INITIATIVE">
            <Text size="sm">{initiative}</Text>
        </Attribute>
    );
}


export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 25, hp: randomRange(5, 15) }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="center">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <NameAttribute observer={character.nameObserver} />
                <InitiativeAttribute observer={character.initiativeObserver} />
                <HpAttribute hp={character.hp} />
            </Flex>
        </Paper>
    );
}
