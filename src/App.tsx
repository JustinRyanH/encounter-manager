import React from "react";
import { AppShell, } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { createMemoryRouter, RouterProvider, Outlet } from "react-router-dom";
import { EncounterList } from "~/components/encounter/EncounterList";
import { DisplayEncounter } from "~/components/encounter/DisplayEncounter";

function RootApp() {
  return (
    <AppShell header={<AppHeader/>}>
      <EncounterProvider>
        <Outlet/>
      </EncounterProvider>
    </AppShell>
  )
}


const router = createMemoryRouter([
  {
    path: "/",
    element: <RootApp/>,
    children: [
      {
        path: "/",
        element: <EncounterList/>,
      },
      {
        path: "/encounter/:encounterId",
        element: <DisplayEncounter/>
      },
    ],
  },
]);

function App() {
  return (<RouterProvider router={router}/>);
}

export default App;
