import React from "react";
import { AppShell, } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { createMemoryRouter,RouterProvider } from "react-router-dom";
import { EncounterList } from "~/components/encounter/EncounterList";

const router = createMemoryRouter([
  {
    path: "/",
    element: <EncounterList/>
  },
  {
    path: "/encounter/:encounterId",
    element: <div>Encounter</div>
  }
]);

function App() {
  return (<AppShell header={<AppHeader/>}>
    <EncounterProvider>
      <RouterProvider router={router}/>
    </EncounterProvider>
  </AppShell>);
}

export default App;
