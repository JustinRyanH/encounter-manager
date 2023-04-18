import React from "react";
import { Accordion, Button, Center, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";

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


export function EncounterCharacter({ character }: { character: InitiativeCharacter }): JSX.Element {
    const name = useWatchValueObserver(character.nameObserver);
    const current = useWatchValueObserver(character.hp.currentObserver);
    const total = useWatchValueObserver(character.hp.totalObserver);
    const temp = useWatchValueObserver(character.hp.tempObserver);

    return (
        <Accordion.Item value={character.id}>
            <Accordion.Control>
                <Group spacing="sm" style={{ minWidth: '28rem' }}>
                    <Center maw={75}>
                        <Skeleton radius="lg" width={25} height={25} animate={false}/>
                    </Center>
                    <Text>{name}</Text>
                    <Text>{current + temp} / {total}</Text>
                </Group>
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
