import React from "react";
import { Accordion, ActionIcon, Group, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ArrowBendRightDown, Play, PlayPause, UserPlus } from '@phosphor-icons/react';

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";

function ManageEncounter() {
    const encounter = useEncounterContext();
    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
    const isCharacterActive = activeCharacter !== null;

    const startTopTitle = isCharacterActive ? "Pause Encounter" : "Restart Encounter";
    const startStopAction = isCharacterActive ? encounter.stopEncounter : encounter.restartEncounter;
    const openAddCharacterModal = () => modals.openContextModal({
        modal: "addCharacterToEncounter",
        title: "Add Character",
        innerProps: {},
    });

    return (
        <Group p="1rem" align="center" position="apart">
            <ActionIcon title="Add Character" onClick={openAddCharacterModal}>
                <UserPlus />
            </ActionIcon>
            <Group align="center" position="right">
                <ActionIcon title="Start Encounter" disabled={Boolean(activeCharacter)} onClick={() => encounter.startEncounter()}> <Play /> </ActionIcon>
                <ActionIcon title={startTopTitle} onClick={startStopAction}> <PlayPause /> </ActionIcon>
                <ActionIcon title="Next Turn" disabled={!isCharacterActive} onClick={() => encounter.nextCharacter()}>
                    <ArrowBendRightDown />
                </ActionIcon>
            </Group>
        </Group>
    )
}


export function DisplayEncounter() {
    return <Loader size="xl" />;
    // const encounter = useEncounterContext();
    // const characters = useWatchValueObserver(encounter.charactersObserver);
    // const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
    // const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);
    //
    // const { classes } = useStyles();
    //
    // return (
    //     <>
    //         <ManageEncounter />
    //         <Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
    //             {characters.map((c) => <EncounterCharacter viewEncounter={viewEncounter} character={c} key={c.id} />)}
    //         </Accordion>
    //     </>
    // );
}