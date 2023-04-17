import React from "react";
import { Flex, Paper, Popover, Skeleton, Text, UnstyledButton } from "@mantine/core";

import {InitiativeCharacter} from "~/services/InititativeCharacter";
import {useWatchValueObserver} from "~/hooks/watchValueObserver";
import {ValueObserver} from "~/services/ValueObserver";
import {Attribute} from "~/components/Attribute";
import {HpAttribute} from "~/components/HpAttribute";

/**
 * Returns a random integer between min (inclusive) and max (inclusive). 
 * @param min 
 * @param max 
 * @returns 
 */
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function NameAttribute({ observer }: { observer: ValueObserver<string> }): JSX.Element {
    const name = useWatchValueObserver(observer.readonly);
    return (
        <Popover position="right" withArrow>
            <Popover.Target>
                <UnstyledButton>
                    <Attribute title="NAME">
                        <Text size="sm">{name}</Text>
                    </Attribute>

                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
                Poop
            </Popover.Dropdown>
        </Popover>
    );
}

function InitiativeAttribute({ observer }: { observer: ValueObserver<number> }) {
    const initiative = useWatchValueObserver(observer.readonly);

    return (
        <Attribute title="INITIATIVE">
            <Text size="sm">{initiative}</Text>
        </Attribute>
    );
}


export function CharacterInInitiative(): JSX.Element {
    const character = React.useMemo(() => new InitiativeCharacter({ name: 'Temp Name', initiative: 25, hp: randomRange(5, 15) }), []);
    return (
        <Paper p="xl" shadow="md" withBorder>
            <Flex gap="sm" align="center">
                <Skeleton radius="lg" width={50} height={50} animate={false} />
                <NameAttribute observer={character.nameObserver} />
                <InitiativeAttribute observer={character.initiativeObserver} />
                <HpAttribute hp={character.hp} />
            </Flex>
        </Paper>
    );
}
