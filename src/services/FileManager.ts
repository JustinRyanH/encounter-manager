import { notifications } from "@mantine/notifications";
import { v4 } from "uuid";
import { TauriConnection } from "~/services/TauriConnection";

import { FileChangeEvent, FileSimpleChange, FileRename } from "~/BackendTypes";

export class BaseFileManager {
    #uuid: string;

    constructor() {
        this.#uuid = v4();
    }

    get uuid() {
        return this.#uuid;
    }
}

function notifySimpleEvent(title: string, simpleEvent?: FileSimpleChange) {
    if (!simpleEvent) return;
    notifications.show({ title, message: simpleEvent.path, color: 'green' });
}

function notifyRename(title: string, rename?: FileRename) {
    if (!rename) return;
    notifications.show({ title, message: `${rename.from} -> ${rename.to}`, color: 'green' });
}

export class TauriFileManager extends BaseFileManager {
    #connection;

    constructor() {
        super();
        this.#connection = new TauriConnection<FileChangeEvent>({ name: "file_system:update" });
        this.#connection.addConnection((event) => {
            notifySimpleEvent("File Created", event.Create);
            notifySimpleEvent("File Deleted", event.Delete);
            notifySimpleEvent("File Modified", event.Modify);
            notifyRename("File Renamed", event.RenameBoth);
        });
    }

    async startWatching() {
        this.#connection.start();
    }
}