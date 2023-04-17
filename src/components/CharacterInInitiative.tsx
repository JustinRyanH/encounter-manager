import React, {MouseEvent, MouseEventHandler} from "react";
import {
    Button,
    Divider,
    Flex,
    FocusTrap,
    NumberInput,
    Paper,
    Popover,
    rem,
    Skeleton,
    Stack,
    Text,
    UnstyledButton
} from "@mantine/core";
import {IconMinus, IconPlus} from "@tabler/icons-react";

import {InitiativeCharacter} from "~/services/InititativeCharacter";
import {HitPoints} from "~/services/HitPoints";
import {useWatchValueObserver} from "~/hooks/watchValueObserver";
import {ValueObserver} from "~/services/ValueObserver";
import {Attribute} from "~/components/Attribute";
import {useDisclosure} from "@mantine/hooks";

/**
 * Returns a random integer between min (inclusive) and max (inclusive). 
 * @param min 
 * @param max 
 * @returns 
 */
function randomRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function UpdateHealth({ hp }: { hp: HitPoints }): JSX.Element {
    const [change, setChange] = React.useState<number | ''>('');

    const handleHeal = () => {
        if (change === '') return;
        hp.heal(change);
        setChange('');
    }

    const handleDamage = () => {
        if (change === '') return;
        hp.damage(change);
        setChange('');
    }

    return (
        <FocusTrap>
            <Flex align="center" gap="xs">
                <NumberInput value={change} onChange={setChange} styles={{ input: { width: rem(60) } }} hideControls />
                <Stack spacing="xs">
                    <HealthButton onClick={handleHeal} icon={<IconPlus />} color="green">Heal</HealthButton>
                    <HealthButton onClick={handleDamage} icon={<IconMinus />} color="red">Damage</HealthButton>
                </Stack>
                <Divider orientation="vertical" />
                <NumberInput placeholder="TEMP" styles={{ input: { width: rem(70) } }} hideControls />
            </Flex>
        </FocusTrap>
    );


    interface HealthButtonProps {
        icon?: React.ReactNode;
        color?: string;
        children: React.ReactNode;
        onClick?: MouseEventHandler<HTMLButtonElement>;
    }

    function HealthButton({ icon, color, children, onClick }: HealthButtonProps): JSX.Element {
        return (<Button
            size="xs"
            leftIcon={icon}
            color={color}
            styles={{ inner: { justifyContent: "flex-start" } }}
            onClick={onClick}
            fullWidth
            compact
            uppercase
        >
            {children}
        </Button>);
    }
}

function HpAttribute({ hp }: { hp: HitPoints }): JSX.Element {
    const current = useWatchValueObserver(hp.currentObserver.readonly);
    const total = useWatchValueObserver(hp.totalObserver.readonly);
    const temporary = useWatchValueObserver(hp.tempObserver.readonly);

    return (
        <Popover position="left">
            <Popover.Target>
                <UnstyledButton>
                    <Attribute title="HIT POINTS">
                        <Text size="sm">{current + temporary}</Text>
                        <Text size="sm">/</Text>
                        <Text size="sm">{total}</Text>
                        <Divider orientation="vertical" />
                        <Text>--</Text>
                    </Attribute>
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown> <UpdateHealth hp={hp} /> </Popover.Dropdown>
        </Popover>
    );
}

function NameAttribute({ observer }: { observer: ValueObserver<string> }): JSX.Element {
    const name = useWatchValueObserver(observer.readonly);
    return (
        <Attribute title="NAME">
            <Text size="sm">{name}</Text>
        </Attribute>
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
