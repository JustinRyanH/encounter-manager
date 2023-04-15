import { Divider, NumberInput, Stack, Title } from "@mantine/core";
import React from "react";

import { useWatchValueObserver } from "../../hooks/watchValueObserver";
import { ValueObserver } from "../../services/ValueObserver";

export interface SimpleNumberAttributeProps {
    title: string;
    observer: ValueObserver<number>;
    cannotEdit?: boolean;
}

export function SimpleNumberAttribute({ title, observer, cannotEdit = false }: SimpleNumberAttributeProps): JSX.Element {
    const [isEditing, setIsEditng] = React.useState(false);
    const [value, setValue] = useWatchValueObserver(observer);
    const handleOnDoubleClick = () => {
        if (cannotEdit) return;
        setIsEditng(true);
    };
    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <NumberInput
            onDoubleClick={handleOnDoubleClick}
            onBlur={() => setIsEditng(false)}
            aria-label={title}
            value={value}
            onChange={setValue}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing} />
    </Stack>);
}
