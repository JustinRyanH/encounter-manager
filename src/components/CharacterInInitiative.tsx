import React from "react";
import { Flex, Paper, Skeleton, Text } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { ValueObserver } from "~/services/ValueObserver";
import { Attribute } from "~/components/Attribute";
import { HpAttribute } from "~/components/HpAttribute";
import { NameAttribute } from "~/components/NameAttribute";

/**
 * Returns a random integer between min (inclusive) and max (inclusive). 
 * @param min 
 * @param max 
 * @returns 
 */
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
                <NameAttribute character={character} />
                <InitiativeAttribute observer={character.initiativeObserver} />
                <HpAttribute hp={character.hp} />
            </Flex>
        </Paper>
    );
}
