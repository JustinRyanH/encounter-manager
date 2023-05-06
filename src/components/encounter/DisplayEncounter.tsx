import React from "react";
import { Accordion, ActionIcon, Group } from "@mantine/core";
import { Pause, Play, PlayPause } from '@phosphor-icons/react';

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { EncounterCharacter } from "~/components/encounter/EncounterCharacter";
import { useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";

function ManageEncounter() {
    const encounter = useEncounterContext();
    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
    const isCharacterActive = activeCharacter !== null;

    const {
        playPause,
        label
    } = React.useMemo(() => {
        return {
            playPause: isCharacterActive ? encounter.stopEncounter : () => { encounter.restartEncounter(); console.log('here'); },
            label: isCharacterActive ? "Stop Encounter" : "Restart Encounter"
        }
    }, [encounter, isCharacterActive]);

    return (
        <Group p="1rem" align="center" position="right">
            <ActionIcon title="Start Encounter" disabled={Boolean(activeCharacter)} onClick={() => encounter.startEncounter()}>
                <Play />
            </ActionIcon>
            <ActionIcon title={label} color="gray" onClick={playPause}>
                {isCharacterActive ? <Pause /> : <PlayPause />}
            </ActionIcon>
        </Group>
    )
}


export function DisplayEncounter() {
    const encounter = useEncounterContext();
    const characters = useWatchValueObserver(encounter.charactersObserver);
    const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
    const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);

    const { classes } = useStyles();

    return (
        <>
            <ManageEncounter />
            <Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
                {characters.map((c) => <EncounterCharacter viewEncounter={viewEncounter} character={c} key={c.id} />)}
            </Accordion>
        </>
    );
}