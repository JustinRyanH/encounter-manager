import React from "react";
import { Center, Group, Paper, Skeleton, Text } from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { HpAttribute } from "~/components/HpAttribute";
import { NameAttribute } from "~/components/NameAttribute";
import { EditPopover } from "~/components/EditPopover";
import { UpdateNumber } from "~/components/UpdateAttribute";

function InitiativeAttribute({ character }: { character: InitiativeCharacter }) {
    const initiative = useWatchValueObserver(character.initiativeObserver);

    return (
        <Attribute title="INITIATIVE">
            <EditPopover titleComponent={<Text size="sm">{initiative}</Text>}>
                <UpdateNumber placeholder="Initiative" updateAttribute={character.updateInitiative}/>
            </EditPopover>
        </Attribute>
    );
}


export function CharacterInInitiative({ character }: { character: InitiativeCharacter }): JSX.Element {
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Group spacing="sm" style={{ minWidth: '28rem' }}>
                <Center maw={75}>
                    <Skeleton radius="lg" width={50} height={50} animate={false}/>
                </Center>
                <NameAttribute character={character}/>
                <InitiativeAttribute character={character}/>
                <HpAttribute hp={character.hp}/>
            </Group>
        </Paper>
    );
}
