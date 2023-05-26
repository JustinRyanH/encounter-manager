import React from "react";
import { ModalsProvider } from "@mantine/modals";
import { NewCharacter } from "~/components/encounter/modals/NewCharacter";

export function EncounterModals({ children }: { children: React.ReactNode }): JSX.Element {
  return <ModalsProvider modals={{ newCharacterModal: NewCharacter }}>{children}</ModalsProvider>;
}
