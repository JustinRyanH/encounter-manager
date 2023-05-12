import React from "react";
import { Text } from "@mantine/core";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/systems/Attribute";
import { EncounterCharacter } from "~/services/encounter/EncounterCharacter";
import { EditPopover } from "~/components/systems/EditPopover";
import { UpdateString } from "~/components/systems/UpdateAttribute";
import { useEncounterContext } from "~/components/encounter/EncounterContext";

export function NameAttribute({ character }: { character: EncounterCharacter }): JSX.Element {
  const encounter = useEncounterContext();
  const name = useWatchValueObserver(character.nameObserver);

  return (
    <Attribute title="NAME" grow={2}>
      <EditPopover
        titleComponent={
          <Text size="sm" align="center">
            {name}
          </Text>
        }
      >
        <UpdateString
          width="10rem"
          updateAttribute={(name) => {
            encounter.updateCharacterName(character.id, name).catch((e) => console.error(e));
            character.updateName(name);
          }}
          placeholder="Name"
        />
      </EditPopover>
    </Attribute>
  );
}
