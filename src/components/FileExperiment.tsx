import React from "react";
import { Stack, Title, Text } from "@mantine/core";

import { useFileManager } from "~/components/FileManager";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";

function Directory({ name }: { name: string }) {
    const fileManager = useFileManager();
    const directory = React.useMemo(() => fileManager.getDirectory(name), [fileManager, name]);
    const files = useWatchValueObserver(directory);
    React.useEffect(() => {
        console.log({ files, name, directory });
    }, [files, name]);


    return <Stack>
        <Title order={4}>{name}</Title>
        {files.map((file) => <Text key={file.path}>{file.name}</Text>)}
    </Stack>
}

export function FileExperiment() {
    const fileManager = useFileManager();
    const rootDirectory = useWatchValueObserver(fileManager.rootNamePublisher);
    React.useEffect(() => {
        fileManager.startWatching();
        fileManager.getRoot();
    }, [fileManager]);

    return <Stack>
        <Directory name={rootDirectory} />
    </Stack>
}