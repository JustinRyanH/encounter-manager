import React from "react";
import { Button, Stack } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { v4 } from "uuid";
import { useFileManager } from "~/components/FileManager";

class ListenSingleton {
    private static instance: ListenSingleton;
    #stopListening: UnlistenFn | null = null;
    #uuid ;

    static get(): ListenSingleton {
        if (!ListenSingleton.instance) {
            ListenSingleton.instance = new ListenSingleton();
        }
        return ListenSingleton.instance;
    }

    private constructor() {
        this.#uuid = v4();
        this.setupListener();
    }

    get uuid() {
        return this.#uuid;
    }

    private async setupListener() {
        this.#stopListening = await listen(
            "test",
            (event) => console.log(this.uuid, event)
        );
    }
}




export function FileExperiment() {
    const fileManager = useFileManager();
    React.useEffect(() => {
        fileManager.startWatching();
        console.log('fileManager.uuid', fileManager.uuid);
    }, [fileManager]);
    return <Stack>
        <Button onClick={() => invoke('test_data')}>Do Stuff</Button>
    </Stack>
}