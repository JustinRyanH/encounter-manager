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
import { Attribute } from "~/components/systems/Attribute";
import { HpAttribute } from "~/components/encounter/HpAttribute";
import { NameAttribute } from "~/components/encounter/NameAttribute";
import { EditPopover } from "~/components/systems/EditPopover";
import { UpdateNumber } from "~/components/encounter/UpdateAttribute";

import { useStyles } from "./EncounterCharacter.styles";
import { IconCornerRightDownDouble } from "@tabler/icons-react";
import { useEncounterContext } from "~/components/encounter/EncounterContext";

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

    return (<Group spacing="sm">
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

const NextButtonSx = {
    '&[data-disabled]': {
        opacity: 0.2,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
    },
};

interface EncounterCharacterProps extends AccordionControlProps {
    inPlay: boolean,
    nextTurn: () => void,
}

function EncounterControl(props: EncounterCharacterProps) {
    return (<Paper radius="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Accordion.Control {...props} />
            <ActionIcon
                color="dark"
                disabled={!props.inPlay}
                size="md"
                sx={NextButtonSx}
                variant="subtle"
                onClick={props.nextTurn}
            >
                <IconCornerRightDownDouble size="1.75rem"/>
            </ActionIcon>
        </Box>
    </Paper>);
}

export function EncounterCharacter({ character }: { character: InitiativeCharacter }): JSX.Element {
    const encounter = useEncounterContext();

    const inPlay = useWatchValueObserver(character.inPlayObserver);
    const { classes, cx } = useStyles();
    return (
        <Accordion.Item data-in-play={inPlay}  className={cx(classes.accordion, classes.inPlay)} value={character.id}>
            <EncounterControl inPlay={inPlay} nextTurn={encounter.nextCharacter}>
                <EncounterCharacterControl character={character}/>
            </EncounterControl>
            <Accordion.Panel>
                <Paper radius="lg" p="sm">
                    <Group spacing="sm">
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
