import React from "react";
import { AppShell } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { EncounterList } from "~/components/encounter/EncounterList";
import { DisplayEncounterRoute } from "~/components/encounter/display";
import { EncounterManagerProvider } from "~/components/encounter/EncounterManagerProvider";

function RootApp() {
  return (
    <EncounterManagerProvider>
      <AppShell header={<AppHeader />}>
        <Outlet />
      </AppShell>
    </EncounterManagerProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootApp />,
    children: [
      {
        path: "/",
        element: <EncounterList />,
      },
      {
        path: "/encounter/:encounterId",
        element: <DisplayEncounterRoute />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
