import { ActiveCharacter, Encounter } from "~/services/encounter";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Accordion, AccordionControlProps, ActionIcon, Avatar, Badge, Box, Group } from "@mantine/core";
import { BookOpen } from '@phosphor-icons/react';
import React from "react";
import { useNavigate } from "react-router-dom";

interface ControlProps extends AccordionControlProps {
  encounter: Encounter;
}

function AccordionControl({ encounter, ...props }: ControlProps) {
  const navigate = useNavigate()
  const encounterName = useWatchValueObserver(encounter.nameObserver);

  return (<Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Accordion.Control {...props} />
      <ActionIcon onClick={() => {
        console.log('click');
        navigate(`${encounter.id}`);
      }} variant="outline" size="lg" color="grape" title={`Open ${encounterName} Encounter`}>
        <BookOpen size="1rem"/>
      </ActionIcon>
    </Box>
  )
}

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
      <AccordionControl encounter={encounter}>{name}</AccordionControl>
      <Accordion.Panel>
        <Group spacing="xs">
          {listedCharacters}
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  </div>
}