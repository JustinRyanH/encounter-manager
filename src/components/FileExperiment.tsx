import React from "react";
import { Button, Stack } from "@mantine/core";
import { invoke } from "@tauri-apps/api";

import { useFileManager } from "~/components/FileManager";

export function FileExperiment() {
    const fileManager = useFileManager();
    React.useEffect(() => {
        fileManager.startWatching();
    }, [fileManager]);

    const onClick = async () => {
        await fileManager.getRoot();
    };
    return <Stack>
        <Button onClick={onClick}>Do Stuff</Button>
    </Stack>
}