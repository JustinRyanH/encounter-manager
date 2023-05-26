import React from "react";
import { Accordion, ActionIcon, Group } from "@mantine/core";
import { ArrowBendRightDown, Play, PlayPause, UserPlus } from "@phosphor-icons/react";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Navigate, useParams } from "react-router-dom";
import { modals } from "@mantine/modals";

import { EncounterProvider, useEncounterContext } from "~/components/encounter/providers/EncounterProvider";
import { useEncounterManager } from "~/components/encounter/providers/EncounterManagerProvider";
import { notifyErrors } from "~/services/notifications";
import { CombatEncounter } from "~/services/encounter";

import { DisplayCharacter } from "./character";
import { useStyles } from "./DisplayEncounter.styles";

function AddCharacterButton() {
  const encounter = useEncounterContext();

  const onClick = () => {
    modals.openContextModal({
      modal: "newCharacterModal",
      title: "Create new Character",
      innerProps: {
        encounter: encounter,
      },
    });
  };

  return (
    <ActionIcon onClick={onClick} title="Add Character" disabled={encounter.isStub}>
      <UserPlus />
    </ActionIcon>
  );
}

function ManageEncounter() {
  const encounter = useEncounterContext();
  const activeCharacter = useWatchValueObserver(encounter.activeCharacterObserver);
  const isCharacterActive = activeCharacter !== null;

  const startTopTitle = isCharacterActive ? "Pause Encounter" : "Restart Encounter";
  const startStopAction = isCharacterActive ? encounter.stopEncounter : encounter.restartEncounter;

  React.useEffect(() => {
    return () => {
      encounter.stopEncounter();
    };
  }, [encounter]);

  return (
    <Group p="1rem" align="center" position="apart">
      <AddCharacterButton />
      <Group align="center" position="right">
        <ActionIcon
          title="Start Encounter"
          disabled={encounter.isStub || Boolean(activeCharacter)}
          onClick={() => encounter.startEncounter()}
        >
          <Play />
        </ActionIcon>
        <ActionIcon title={startTopTitle} disabled={encounter.isStub} onClick={startStopAction}>
          <PlayPause />
        </ActionIcon>
        <ActionIcon
          title="Next Turn"
          disabled={encounter.isStub || !isCharacterActive}
          onClick={() => encounter.nextCharacter()}
        >
          <ArrowBendRightDown />
        </ActionIcon>
      </Group>
    </Group>
  );
}

export function DisplayEncounter({ encounter }: { encounter: CombatEncounter }) {
  const characters = useWatchValueObserver(encounter.charactersObserver);
  const viewEncounter = React.useMemo(() => encounter.newViewEncounter, [encounter]);
  const ids = useWatchValueObserver(viewEncounter.openedCharactersObserver);
  const { classes } = useStyles();

  return (
    <EncounterProvider encounter={encounter}>
      <ManageEncounter />
      <Accordion value={ids} classNames={classes} chevronPosition="left" variant="separated" multiple>
        {characters.map((c) => (
          <DisplayCharacter key={c.id} viewEncounter={viewEncounter} character={c} />
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

  return <DisplayEncounter encounter={encounter} />;
}

export function DisplayEncounterRoute() {
  const { encounterId } = useParams();
  if (!encounterId) {
    return <Navigate to="/" />;
  }
  return <LoadEncounter encounterId={encounterId} />;
}
