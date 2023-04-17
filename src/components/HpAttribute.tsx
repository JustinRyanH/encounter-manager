import React, { MouseEventHandler } from "react";
import { useClickOutside, useDebouncedState, useDisclosure } from "@mantine/hooks";
import {
    ActionIcon,
    Button,
    Divider,
    Flex,
    FocusTrap,
    HoverCard,
    NumberInput,
    Popover,
    rem,
    Stack,
    Text, Transition,
    UnstyledButton
} from "@mantine/core";
import { IconArrowBadgeRight, IconMinus, IconPlus } from "@tabler/icons-react";

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

    const ref = useClickOutside(() => handles.close(), ['mousedown', 'touchstart']);

    return (
        <Flex ref={ref} align="center" gap="xs">
            <NumberInput
                hideControls
                onChange={setTemp}
                placeholder="TEMP"
                styles={{ input: { width: rem(70) } }}
                value={temp}
                onKeyDown={handleKeyDown}
            />
            <ActionIcon title="Set Temp" onClick={() => hp.setTemp(temp || 0)}>
                <IconArrowBadgeRight size="1.75rem" />
            </ActionIcon>
        </Flex>
    );
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
        <Flex align="center" gap="xs">
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
            <UpdateTempHealth hp={hp} handles={handles} />
        </Popover.Dropdown>
    </Popover>)
}

function EditHealthPopover({ hp, children }: { hp: HitPoints, children: React.ReactNode }): JSX.Element {
    return (<Popover
        position="top"
        withArrow
        trapFocus
        returnFocus
    >
        <Popover.Target>
            <UnstyledButton>
                {children}
            </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
            <UpdateHealth hp={hp} />
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