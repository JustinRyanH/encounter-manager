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
        const result = await invoke('query_file_system', { command: { command: 'root' } });
        console.log({ result });
    };
    return <Stack>
        <Button onClick={onClick}>Do Stuff</Button>
    </Stack>
}