import React from "react";
import { Flex, Paper, Skeleton, Text } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { ReadonlyValueObserver } from "~/services/ValueObserver";
import { Attribute } from "~/components/Attribute";
import { HpAttribute } from "~/components/HpAttribute";
import { NameAttribute } from "~/components/NameAttribute";
import { EditPopover } from "~/components/EditPopover";

/**
 * Returns a random integer between min (inclusive) and max (inclusive). 
 * @param min 
 * @param max 
 * @returns 
 */

function InitiativeAttribute({ observer }: { observer: ReadonlyValueObserver<number> }) {
    const initiative = useWatchValueObserver(observer);

    return (
        <Attribute title="INITIATIVE">
            <EditPopover titleComponent={<Text size="sm">Initiative</Text>}>
                <Text size="xl">{initiative}</Text>
            </EditPopover>
        </Attribute>
    );
}


export function CharacterInInitiative({ character }: { character: InitiativeCharacter }): JSX.Element {
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
