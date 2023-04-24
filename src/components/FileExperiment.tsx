import React from "react";
import { BaseDirectory, createDir, exists, readDir } from '@tauri-apps/api/fs';


const ENCOUNTER_MANAGER_FOLDER = 'Encounter Manager';
export function FileExperiment() {
    React.useEffect(() => {
        const makeDir = async () => {
            const doesFolderExist = await exists(ENCOUNTER_MANAGER_FOLDER, { dir: BaseDirectory.Document });
            if (!doesFolderExist) {
                await createDir(ENCOUNTER_MANAGER_FOLDER, { dir: BaseDirectory.Document, recursive: true });
            }
            const entries = await readDir(ENCOUNTER_MANAGER_FOLDER, { dir: BaseDirectory.Document, recursive: true });
            entries.forEach(e => console.log(e.name));
        };


        makeDir().catch(console.error);
    }, []);
    return <p>Manage Files</p>;
}