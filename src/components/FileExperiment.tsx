import React from "react";
import { invoke } from '@tauri-apps/api';
import { notifications } from "@mantine/notifications";
import { Stack, Text } from "@mantine/core";

export function FileExperiment() {
    const [files, setFiles] = React.useState<string[]>([]);
    React.useEffect(() => {
        invoke('browse_document_files')
            .then((result) => setFiles(result as string[]))
            .catch((error) => {
                notifications.show({
                    title: 'Error',
                    message: error,
                    color: 'red',
                });
            });
    }, []);
    return <Stack>
        {files.map((f) => <Text key={f}>{f}</Text>)}
    </Stack>
}