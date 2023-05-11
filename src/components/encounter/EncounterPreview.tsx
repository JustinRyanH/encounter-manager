import { ActiveCharacter, Encounter } from "~/services/encounter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Accordion, Avatar, Badge, Group } from "@mantine/core";
import React from "react";

function EncounterPreviewCharacter({ character }: { character: ActiveCharacter }) {
    const name = useWatchValueObserver(character.nameObserver);
    const avatar = <Avatar size={32} radius="xl"/>;

    return <Badge leftSection={avatar} size="lg"> {name} </Badge>;
}

export function EncounterPreview({ encounter }: { encounter: Encounter }) {
    const name = useWatchValueObserver(encounter.nameObserver);
    const characters = useWatchValueObserver(encounter.charactersObserver);
    const listedCharacters = characters.map((character) => <EncounterPreviewCharacter character={character}
                                                                                      key={character.id}/>);
    return <div>
        <Accordion.Item value={encounter.id}>
            <Accordion.Control>{name}</Accordion.Control>
            <Accordion.Panel>
                <Group spacing="xs">
                    {listedCharacters}
                </Group>
            </Accordion.Panel>
        </Accordion.Item>
    </div>
}