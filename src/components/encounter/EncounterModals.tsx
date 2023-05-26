import React from "react";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import { Button, Title } from "@mantine/core";
import { Encounter } from "~/services/encounter/CombatEncounter";

const NewCharacterModal = ({ id, context }: ContextModalProps<{ encounter: Encounter }>) => {
  return (
    <>
      <Button onClick={() => context.closeModal(id)}>Cancel</Button>
    </>
  );
};

export function EncounterModals({ children }: { children: React.ReactNode }): JSX.Element {
  return <ModalsProvider modals={{ newCharacterModal: NewCharacterModal }}>{children}</ModalsProvider>;
}
