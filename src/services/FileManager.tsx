import { notifications } from "@mantine/notifications";
import { v4 } from "uuid";
import { TauriConnection } from "~/services/TauriConnection";

export class BaseFileManager {
    #uuid: string;

    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}

export class NullFileManger extends BaseFileManager {
    constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async startWatching() {
    }
}

interface ExampleStruct {
    name: string;
    age: number,
}

export class TauriFileManager extends BaseFileManager {
    #connection;

    constructor() {
        super();
        this.#connection = new TauriConnection<ExampleStruct>({ name: "file_system:update" });
        this.#connection.addConnection(event => {
            notifications.show({ title: "File System", message: JSON.stringify(event), color: 'green' });
        });
    }

    async startWatching() {
        this.#connection.start();
    }
}