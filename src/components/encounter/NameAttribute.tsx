import React from "react";
import { Text } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { InitiativeCharacter } from "~/services/InititativeCharacter";
import { EditPopover } from "~/components/EditPopover";
import { UpdateString } from "~/components/encounter/UpdateAttribute";


export function NameAttribute({ character }: { character: InitiativeCharacter }): JSX.Element {
    const name = useWatchValueObserver(character.nameObserver);

    return (
        <Attribute title="NAME" grow={2}>
            <EditPopover titleComponent={<Text size="sm" align="center">{name}</Text>}>
                <UpdateString width="10rem" updateAttribute={character.updateName} placeholder="Name" />
            </EditPopover>
        </Attribute>
    );
}