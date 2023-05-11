import React from "react";
import { AppShell, } from "@mantine/core";

import { AppHeader } from "~/components/AppHeader";

import "./App.css";
import { EncounterProvider } from "~/components/encounter/EncounterContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EncounterList } from "~/components/encounter/EncounterList";

function App() {
    return (<AppShell header={<AppHeader/>}>
        <EncounterProvider>
            <MemoryRouter initialEntries={['/encounters']}>
                <Routes>
                    <Route path="/encounters" element={<EncounterList/>}/>
                </Routes>
            </MemoryRouter>
        </EncounterProvider>
    </AppShell>);
}

export default App;
