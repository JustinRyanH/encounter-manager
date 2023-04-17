import React, { KeyboardEvent, MouseEventHandler } from "react";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import {
    ActionIcon,
    Button,
    Divider,
    Flex,
    NumberInput,
    Popover,
    rem,
    SimpleGrid,
    Stack,
    Text,
    UnstyledButton
} from "@mantine/core";
import { IconCheck, IconMinus, IconPlus } from "@tabler/icons-react";

import { HitPoints } from "~/services/HitPoints";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/Attribute";
import { DisclousreHandles } from "./interfaces";


interface HealthButtonProps {
    icon?: React.ReactNode;
    color?: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

function UpdateTempHealth({ hp, handles }: { hp: HitPoints, handles: DisclousreHandles }): JSX.Element {
    const [temp, setTemp] = React.useState<number | ''>('');
    const commitTempHp = () => {
        if (temp !== '') {
            hp.setTemp(temp || 0);
            setTemp('');
        }
        handles.close();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handles.close();
            return;
        }
        if (e.key === 'Enter') {
            commitTempHp();
        }
    }

    return (
        <>
            <NumberInput
                hideControls
                onChange={setTemp}
                placeholder="new temp"
                styles={{ input: { width: rem(90), textAlign: 'center' } }}
                value={temp}
                onKeyDown={handleKeyDown} /><ActionIcon title="Set Temp" onClick={commitTempHp}>
                <IconCheck size="1.75rem" />
            </ActionIcon>
        </>
    );
}

function UpdateHealth({ hp, handles }: { hp: HitPoints, handles: DisclousreHandles }): JSX.Element {
    const current = useWatchValueObserver(hp.currentObserver.readonly);
    const temp = useWatchValueObserver(hp.tempObserver.readonly);

    const [change, setChange] = React.useState<number | ''>('');

    const handleHeal = () => {
        if (change === '') return;
        hp.heal(change);
        setChange('');
        handles.close();
    }

    const handleDamage = () => {
        if (change === '') return;
        hp.damage(change);
        setChange('');
        handles.close();
    }

    const onEscape = (e: KeyboardEvent<HTMLElement>) => e.key === 'Escape' && handles.close();

    const ref = useClickOutside(() => handles.close(), ['mousedown', 'touchstart']);

    return (
        <Flex ref={ref} align="center" gap="xs" onKeyDown={onEscape}>
            <SimpleGrid cols={2} spacing="xs">
                <Text fw={700} size="sm">Current</Text>
                <Text fw={700} size="sm">Temp</Text>
                <Text size="sm">{current}</Text>
                <Text size="sm">{temp}</Text>
            </SimpleGrid>
            <Divider orientation="vertical" />
            <NumberInput value={change} onChange={setChange} styles={{ input: { width: rem(60) } }} hideControls />
            <Stack spacing="xs">
                <HealthButton onClick={handleHeal} icon={<IconPlus />} color="green">Heal</HealthButton>
                <HealthButton onClick={handleDamage} icon={<IconMinus />} color="red">Damage</HealthButton>
            </Stack>
        </Flex>
    );

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


function EditTempPopover({ hp, children }: { hp: HitPoints, children: React.ReactNode }): JSX.Element {
    const [opened, handles] = useDisclosure(false);
    const ref = useClickOutside(() => handles.close(), ['mousedown', 'touchstart']);

    return (<Popover
        position="top"
        withArrow
        trapFocus
        returnFocus
        opened={opened}
    >
        <Popover.Target>
            <UnstyledButton onClick={handles.open}>
                {children}
            </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
            <Flex ref={ref} align="center" gap="xs">
                <UpdateTempHealth hp={hp} handles={handles} />
            </Flex>
        </Popover.Dropdown>
    </Popover>)
}

function EditHealthPopover({ hp, children }: { hp: HitPoints, children: React.ReactNode }): JSX.Element {
    const [opened, handles] = useDisclosure(false);
    return (<Popover
        position="top"
        withArrow
        trapFocus
        returnFocus
        opened={opened}
    >
        <Popover.Target>
            <UnstyledButton onClick={handles.open}>
                {children}
            </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
            <UpdateHealth hp={hp} handles={handles} />
        </Popover.Dropdown>
    </Popover>)
}

export function HpAttribute({ hp }: { hp: HitPoints }): JSX.Element {
    const current = useWatchValueObserver(hp.currentObserver.readonly);
    const total = useWatchValueObserver(hp.totalObserver.readonly);
    const temporary = useWatchValueObserver(hp.tempObserver.readonly);

    const boldIfWeighted = temporary > 0 ? 700 : undefined;
    const blueIfWeighted = temporary > 0 ? 'blue' : undefined;

    return (
        <Attribute title="HIT POINTS">
            <EditHealthPopover hp={hp}>
                <Text fw={boldIfWeighted} color={blueIfWeighted} size="sm">{current + temporary}</Text>
            </EditHealthPopover>
            <Text size="sm">/</Text>
            <Text size="sm">{total}</Text>
            <Divider orientation="vertical" />
            <EditTempPopover hp={hp}>
                <Text size="sm">{temporary || '--'}</Text>
            </EditTempPopover>
        </Attribute>
    );
}