import React, { KeyboardEvent, MouseEventHandler } from "react";
import { useClickOutside } from "@mantine/hooks";
import { Button, Divider, Flex, NumberInput, SimpleGrid, Stack, Text } from "@mantine/core";
import { Minus, Plus } from '@phosphor-icons/react';

import { HitPoints } from "~/services/encounter/HitPoints";
import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { Attribute } from "~/components/systems/Attribute";
import { EditPopover, useEditPopoverContext } from "~/components/systems/EditPopover";
import { UpdateNumber } from "~/components/systems/UpdateAttribute";


interface HealthButtonProps {
    icon?: React.ReactNode;
    color?: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

function UpdateHealth({ hp }: { hp: HitPoints }): JSX.Element {
    const { handles } = useEditPopoverContext();
    const current = useWatchValueObserver(hp.currentObserver);
    const temp = useWatchValueObserver(hp.tempObserver);

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
            <NumberInput value={change} onChange={setChange} styles={{ input: { width: '5rem', textAlign: 'center' } }} hideControls />
            <Stack spacing="xs">
                <HealthButton onClick={handleHeal} icon={<Plus />} color="green">Heal</HealthButton>
                <HealthButton onClick={handleDamage} icon={<Minus />} color="red">Damage</HealthButton>
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

export function HpAttribute({ hp }: { hp: HitPoints }): JSX.Element {
    const current = useWatchValueObserver(hp.currentObserver);
    const total = useWatchValueObserver(hp.totalObserver);
    const temporary = useWatchValueObserver(hp.tempObserver);

    const boldIfWeighted = temporary > 0 ? 700 : undefined;
    const blueIfWeighted = temporary > 0 ? 'blue' : undefined;

    return (
        <Attribute title="HIT POINTS" grow={2}>
            <EditPopover titleComponent={<Text fw={boldIfWeighted} color={blueIfWeighted} size="sm">{current + temporary}</Text>}>
                <UpdateHealth hp={hp} />
            </EditPopover>
            <Text size="sm">/</Text>
            <EditPopover titleComponent={<Text size="sm">{total}</Text>}>
                <UpdateNumber placeholder="Total HP" updateAttribute={hp.setTotal} />
            </EditPopover>
            <Divider orientation="vertical" />
            <EditPopover titleComponent={<Text size="sm">{temporary || '--'}</Text>}>
                <UpdateNumber updateAttribute={hp.setTemp} placeholder="Temp HP" />
            </EditPopover>
        </Attribute>
    );
}