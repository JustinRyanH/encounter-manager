import React from "react";
import { ModalsProvider } from "@mantine/modals";

export function EncounterModals({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <ModalsProvider modals={{}}>{children}</ModalsProvider>
    </>
  );
}
