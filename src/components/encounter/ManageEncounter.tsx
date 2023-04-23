import { Encounter } from "~/services/encounter/Encounter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Button, Stack } from "@mantine/core";
import React from "react";

export function ManageEncounter({ encounter }: { encounter: Encounter }) {
    const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
    return (
        <Stack>
            <Button disabled={Boolean(activeCharacter)} onClick={() => encounter.startEncounter()}>
                Start Encounter
            </Button>
            <Button disabled={Boolean(activeCharacter)} color="gray" onClick={() => encounter.restartEncounter()}>
                Restart Encounter
            </Button>
            <Button disabled={!activeCharacter} color="gray" onClick={() => encounter.stopEncounter()}>
                Stop Encounter
            </Button>
        </Stack>
    )
}