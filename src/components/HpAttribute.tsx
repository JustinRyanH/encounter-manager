import React, { MouseEventHandler } from "react";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
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


interface HealthButtonProps {
    icon?: React.ReactNode;
    color?: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

function UpdateHealth({ hp }: { hp: HitPoints }): JSX.Element {
    const actualTemp = useWatchValueObserver(hp.tempObserver.readonly);
    const [change, setChange] = React.useState<number | ''>('');
    const [temp, setTemp] = useDebouncedState<number | ''>(actualTemp || '', 100);

    React.useEffect(() => {
        hp.setTemp(temp || 0);
    }, [temp]);
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

    const handleTempBlur = () => {
        hp.setTemp(temp || 0);
    }

    React.useEffect(() => {
        setTemp(actualTemp || '');
    }, [actualTemp]);

    return (
        <Flex align="center" gap="xs">
            <NumberInput value={change} onChange={setChange} styles={{ input: { width: rem(60) } }} hideControls />
            <Stack spacing="xs">
                <HealthButton onClick={handleHeal} icon={<IconPlus />} color="green">Heal</HealthButton>
                <HealthButton onClick={handleDamage} icon={<IconMinus />} color="red">Damage</HealthButton>
            </Stack>
            <Divider orientation="vertical" />
            <NumberInput
                hideControls
                onBlur={handleTempBlur}
                onChange={setTemp}
                placeholder="TEMP"
                styles={{ input: { width: rem(70) } }}
                value={temp}
            />
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
            <EditHealthPopover hp={hp}>
                <Text size="sm">{temporary || '--'}</Text>
            </EditHealthPopover>
        </Attribute>
    );
}