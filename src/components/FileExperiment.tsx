import React from "react";
import { Button, Stack } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { v4 } from "uuid";

class ListenSingleton {
    private static instance: ListenSingleton;
    #stopListening: UnlistenFn | null = null;
    #uuid ;

    static get(): ListenSingleton {
        if (!ListenSingleton.instance) {
            console.log('creating');
            ListenSingleton.instance = new ListenSingleton();
        }
        console.log('created');
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
    React.useEffect(() => {
        ListenSingleton.get();
    });
    const doStuff = async () => {
        const result = await invoke("test_data");
        console.log(result);
    }
    return <Stack>
        <Button onClick={doStuff}>Do Stuff</Button>
    </Stack>
}