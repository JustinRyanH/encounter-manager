import React from "react";
import { Stack } from "@mantine/core";

import { useFileManager } from "~/components/FileManager";


export function FileExperiment() {
    const fileManager = useFileManager();
    React.useEffect(() => {
        fileManager.startWatching();
    }, [fileManager]);

    return <Stack>
    </Stack>
}