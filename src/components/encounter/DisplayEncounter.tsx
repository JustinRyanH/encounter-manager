import React from "react";
import { Accordion, ActionIcon, Center, Group, Loader } from "@mantine/core";
import { ArrowBendRightDown, Play, PlayPause, UserPlus } from "@phosphor-icons/react";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { DisplayEncounterCharacter } from "~/components/encounter/DisplayEncounterCharacter";
import { EncounterProvider, useEncounterContext } from "~/components/encounter/EncounterContext";
import { useStyles } from "~/components/encounter/DisplayEncounter.styles";
import { Navigate, redirect, useParams } from "react-router-dom";
import { useEncounterManager } from "~/components/encounter/EncounterManagerProvider";
import { notifyErrors } from "~/services/notifications";
import { Encounter } from "~/services/encounter";

function ManageEncounter() {
  const encounter = useEncounterContext();
  const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
  const isCharacterActive = activeCharacter !== null;

  const startTopTitle = isCharacterActive ? "Pause Encounter" : "Restart Encounter";
  const startStopAction = isCharacterActive ? encounter.stopEncounter : encounter.restartEncounter;

  return (
    <Group p="1rem" align="center" position="apart">
      <ActionIcon title="Add Character" disabled>
        <UserPlus />
      </ActionIcon>
      <Group align="center" position="right">
        <ActionIcon
          title="Start Encounter"
          disabled={Boolean(activeCharacter)}
          onClick={() => encounter.startEncounter()}
        >
          <Play />
        </ActionIcon>
        <ActionIcon title={startTopTitle} onClick={startStopAction}>
          <PlayPause />
        </ActionIcon>
        <ActionIcon title="Next Turn" disabled={!isCharacterActive} onClick={() => encounter.nextCharacter()}>
          <ArrowBendRightDown />
        </ActionIcon>
      </Group>
    </Group>
  );
}

function DisplayEncounter({ encounter }: { encounter: Encounter }) {
  const characters = useWatchValueObserver(encounter.charactersObserver);
  const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
  const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);

  const { classes } = useStyles();

  return (
    <EncounterProvider encounter={encounter}>
      <ManageEncounter />
      <Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
        {characters.map((c) => (
          <DisplayEncounterCharacter viewEncounter={viewEncounter} character={c} key={c.id} />
        ))}
      </Accordion>
    </EncounterProvider>
  );
}

function LoadEncounter({ encounterId }: { encounterId: string }) {
  const encounterManager = useEncounterManager();
  const encounterObserver = encounterManager.getEncounter(encounterId);
  const encounter = useWatchValueObserver(encounterObserver.readonly);

  React.useEffect(() => {
    if (encounter.isStub) encounterManager.refreshList().catch(notifyErrors);
  }, [encounter]);

  if (!encounter) {
    return (
      <Center h="100%">
        <Loader variant="bars" size="xl" />
      </Center>
    );
  }
  return <DisplayEncounter encounter={encounter} />;
}

export function DisplayEncounterRoute() {
  const { encounterId } = useParams();
  if (!encounterId) {
    return <Navigate to="/" />;
  }
  return <LoadEncounter encounterId={encounterId} />;
}
