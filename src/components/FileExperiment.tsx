import React from "react";
import { invoke } from '@tauri-apps/api';

export function FileExperiment() {
    React.useEffect(() => {
        invoke('browse_document_files')
            .then((result) => console.log({ browse_document_files: result }))
            .catch((error) => console.error(error));
    }, []);
    return <p>Manage Files</p>;
}