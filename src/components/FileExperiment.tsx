import React from "react";
import { Stack } from "@mantine/core";

import { useFileManager } from "~/components/FileManager";


export function FileExperiment() {
    const fileManager = useFileManager();
    React.useEffect(() => {
        const loadFiles = async () => {
            await fileManager.startWatching();
            await fileManager.loadRootDirectory();
        };
        loadFiles();
    }, [fileManager]);

    return <Stack>
    </Stack>
}