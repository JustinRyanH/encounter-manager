import {
    Accordion,
    AccordionControlProps,
    ActionIcon,
    Box,
    Center,
    Group,
    Paper,
    Popover,
    SimpleGrid,
    Skeleton,
    Text
} from "@mantine/core";

import { ActiveCharacter } from "~/services/encounter/ActiveCharacter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/systems/Attribute";
import { HpAttribute } from "~/components/encounter/HpAttribute";
import { NameAttribute } from "~/components/encounter/NameAttribute";
import { EditPopover } from "~/components/systems/EditPopover";
import { UpdateNumber } from "~/components/systems/UpdateAttribute";

import { ArrowBendRightDown } from '@phosphor-icons/react';
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useDisclosure } from "@mantine/hooks";
import { ViewEncounter } from "~/services/encounter/ViewEncounter";

function InitiativeAttribute({ character }: { character: ActiveCharacter }) {
    const initiative = useWatchValueObserver(character.initiativeObserver);

    return (
        <Attribute title="INITIATIVE">
            <EditPopover titleComponent={<Text size="sm">{initiative}</Text>}>
                <UpdateNumber placeholder="Initiative" updateAttribute={character.updateInitiative} />
            </EditPopover>
        </Attribute>
    );
}


function EncounterCharacterControl({ character }: { character: ActiveCharacter }): JSX.Element {
    const name = useWatchValueObserver(character.nameObserver);
    const current = useWatchValueObserver(character.hp.currentObserver);
    const total = useWatchValueObserver(character.hp.totalObserver);
    const temp = useWatchValueObserver(character.hp.tempObserver);

    const [opened, { close, open }] = useDisclosure(false)

    const hasTemp = temp !== 0;
    const color = hasTemp ? 'blue' : undefined;

    return (<Group spacing="sm">
        <Center maw={75}>
            <Skeleton circle width={25} height={25} animate={false} />
        </Center>
        <Text fz="lg" weight={700}>{name}</Text>
        <Group spacing="xs">
            <Popover position="top" opened={opened}>
                <Popover.Target>
                    <Text onMouseEnter={() => temp && open()} onMouseLeave={close} color={color}>{current + temp}</Text>
                </Popover.Target>
                <Popover.Dropdown>
                    <SimpleGrid verticalSpacing="xs" cols={2}>
                        <Text size="xs" align="right">Current:</Text> <Text size="xs">{current}</Text>
                        <Text size="xs" align="right">Temp:</Text> <Text color="blue" size="xs">{temp}</Text>
                    </SimpleGrid>
                </Popover.Dropdown>
            </Popover>
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

interface EncounterControlProps extends AccordionControlProps {
    inPlay: boolean,
    nextTurn: () => void,
}

function EncounterControl({ inPlay, nextTurn, ...props }: EncounterControlProps) {
    return (<Paper radius="md">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Accordion.Control {...props} />
            <ActionIcon
                color="dark"
                disabled={!inPlay}
                size="md"
                sx={NextButtonSx}
                variant="subtle"
                title="Next Turn"
                onClick={nextTurn}
            >
                <ArrowBendRightDown size="1.75rem" />
            </ActionIcon>
        </Box>
    </Paper>);
}

interface EncounterCharacterProps {
    character: ActiveCharacter,
    viewEncounter: ViewEncounter,
}

export function EncounterCharacter({ character, viewEncounter }: EncounterCharacterProps): JSX.Element {
    const encounter = useEncounterContext();

    const inPlay = useWatchValueObserver(character.inPlayObserver);
    return (
        <Accordion.Item data-in-play={inPlay} value={character.id}>
            <EncounterControl onClick={() => viewEncounter.toggle(character.id)} inPlay={inPlay} nextTurn={encounter.nextCharacter}>
                <EncounterCharacterControl character={character} />
            </EncounterControl>
            <Accordion.Panel sx={{ padding: 0 }}>
                <Paper radius="md" p="sm">
                    <Group spacing="sm">
                        <Center maw={75}>
                            <Skeleton radius="lg" width={50} height={50} animate={false} />
                        </Center>
                        <NameAttribute character={character} />
                        <InitiativeAttribute character={character} />
                        <HpAttribute hp={character.hp} />
                    </Group>
                </Paper>
            </Accordion.Panel>
        </Accordion.Item>
    );
}
