import React, {MouseEventHandler} from "react";
import {useDebouncedState} from "@mantine/hooks";
import {
    Button,
    Divider,
    Flex,
    FocusTrap,
    HoverCard,
    NumberInput,
    Popover,
    rem,
    Stack,
    Text,
    UnstyledButton
} from "@mantine/core";
import {IconMinus, IconPlus} from "@tabler/icons-react";

import {HitPoints} from "~/services/HitPoints";
import {useWatchValueObserver} from "~/hooks/watchValueObserver";
import {Attribute} from "~/components/Attribute";


interface HealthButtonProps {
    icon?: React.ReactNode;
    color?: string;
    children: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

function UpdateHealth({hp}: { hp: HitPoints }): JSX.Element {
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
        <FocusTrap>
            <Flex align="center" gap="xs">
                <NumberInput value={change} onChange={setChange} styles={{input: {width: rem(60)}}} hideControls/>
                <Stack spacing="xs">
                    <HealthButton onClick={handleHeal} icon={<IconPlus/>} color="green">Heal</HealthButton>
                    <HealthButton onClick={handleDamage} icon={<IconMinus/>} color="red">Damage</HealthButton>
                </Stack>
                <Divider orientation="vertical"/>
                <NumberInput
                    hideControls
                    onBlur={handleTempBlur}
                    onChange={setTemp}
                    placeholder="TEMP"
                    styles={{input: {width: rem(70)}}}
                    value={temp}
                />
            </Flex>
        </FocusTrap>
    );

    function HealthButton({icon, color, children, onClick}: HealthButtonProps): JSX.Element {
        return (<Button
            size="xs"
            leftIcon={icon}
            color={color}
            styles={{inner: {justifyContent: "flex-start"}}}
            onClick={onClick}
            fullWidth
            compact
            uppercase
        >
            {children}
        </Button>);
    }
}

export function HpAttribute({hp}: { hp: HitPoints }): JSX.Element {
    const current = useWatchValueObserver(hp.currentObserver.readonly);
    const total = useWatchValueObserver(hp.totalObserver.readonly);
    const temporary = useWatchValueObserver(hp.tempObserver.readonly);

    const boldIfWeighted = temporary > 0 ? 700 : undefined;
    const blueIfWeighted = temporary > 0 ? 'blue' : undefined;

    return (
        <Popover position="left">
            <Popover.Target>
                <UnstyledButton>
                    <Attribute title="HIT POINTS">
                        <HoverCard>
                            <HoverCard.Target>
                                <Text fw={boldIfWeighted} color={blueIfWeighted} size="sm">{current + temporary}</Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">Current: {current}</Text>
                                {temporary > 0 && <Text color="blue" size="sm">Temporary: {temporary}</Text>}
                            </HoverCard.Dropdown>
                        </HoverCard>
                        <Text size="sm">/</Text>
                        <Text size="sm">{total}</Text>
                        <Divider orientation="vertical"/>
                        <Text size="sm">{temporary || '--'}</Text>
                    </Attribute>
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown> <UpdateHealth hp={hp}/> </Popover.Dropdown>
        </Popover>
    );
}