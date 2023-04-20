import React from "react";
import {
    Accordion,
    AccordionControlProps, ActionIcon, Box,
    Center,
    Group,
    Paper,
    Skeleton,
    Text
} from "@mantine/core";

import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { HpAttribute } from "~/components/HpAttribute";
import { NameAttribute } from "~/components/NameAttribute";
import { EditPopover } from "~/components/EditPopover";
import { UpdateNumber } from "~/components/UpdateAttribute";

import { useStyles } from "./EncounterCharacter.styles";
import { IconCornerRightDownDouble, IconPlus } from "@tabler/icons-react";

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
        <Group spacing="xs">
            <Text color={color}>{current + temp}</Text>
            <Text>/</Text>
            <Text>{total}</Text>
        </Group>
    </Group>);
}


function EncounterControl(props: AccordionControlProps) {
    return (<Paper radius="sm">
        <Box sx={{ paddingRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Accordion.Control {...props} />
            <ActionIcon>
                <IconCornerRightDownDouble size="1.75rem"/>
            </ActionIcon>
        </Box>
    </Paper>);
}

export function EncounterCharacter({ character }: { character: InitiativeCharacter }): JSX.Element {
    const inPlay = useWatchValueObserver(character.inPlayObserver);
    const { classes, cx } = useStyles();
    return (
        <Accordion.Item className={cx(classes.accordion, { [classes.inPlay]: inPlay })} value={character.id}>
            <EncounterControl>
                <EncounterCharacterControl character={character}/>
            </EncounterControl>
            <Accordion.Panel>
                <Paper radius="lg" p="sm">
                    <Group spacing="sm" style={{ minWidth: '28rem' }}>
                        <Center maw={75}>
                            <Skeleton radius="lg" width={50} height={50} animate={false}/>
                        </Center>
                        <NameAttribute character={character}/>
                        <InitiativeAttribute character={character}/>
                        <HpAttribute hp={character.hp}/>
                    </Group>
                </Paper>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
