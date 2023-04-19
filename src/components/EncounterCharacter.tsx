import React from "react";
import { Accordion, Button, Center, Divider, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

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


function EncounterCharacterControl({ character }: { character: InitiativeCharacter }): JSX.Element {
    const name = useWatchValueObserver(character.nameObserver);
    const current = useWatchValueObserver(character.hp.currentObserver);
    const total = useWatchValueObserver(character.hp.totalObserver);
    const temp = useWatchValueObserver(character.hp.tempObserver);

    const hasTemp = temp !== 0;
    const color = hasTemp ? 'blue' : undefined;

    return (<Group spacing="sm" style={{ minWidth: '28rem' }}>
        <Center maw={75}>
            <Skeleton circle width={25} height={25} animate={false}/>
        </Center>
        <Text fz="lg" weight={700}>{name}</Text>
        <Divider orientation="vertical" size="xs"/>
        <Group spacing="xs">
            <Text color={color}>{current + temp}</Text>
            <Text>/</Text>
            <Text>{total}</Text>
        </Group>
    </Group>);
}

export function EncounterCharacter({ character }: { character: InitiativeCharacter }): JSX.Element {
    return (
        <Accordion.Item value={character.id}>
            <Accordion.Control>
                <EncounterCharacterControl character={character}/>
            </Accordion.Control>
            <Accordion.Panel>
                <Group spacing="sm" style={{ minWidth: '28rem' }}>
                    <Center maw={75}>
                        <Skeleton radius="lg" width={50} height={50} animate={false}/>
                    </Center>
                    <NameAttribute character={character}/>
                    <InitiativeAttribute character={character}/>
                    <HpAttribute hp={character.hp}/>
                </Group>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
