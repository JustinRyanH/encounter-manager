import { Divider, NumberInput, Stack, Title } from "@mantine/core";
import React from "react";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import {ValueObserver} from "~/services/ValueObserver";

import { SimpleAttributeProps } from "./SimpleAttributeProps";

interface UserAttributeProps {
    observer: ValueObserver<number>;
    cannotEdit: boolean | undefined;
}

interface UserAttributeReturn {
    isEditing: boolean;
    setIsEditing: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    value: number;
    setValue: (v: number) => void;
    handleOnDoubleClick: () => void;
}

function useAttribute({ observer, cannotEdit }: UserAttributeProps): UserAttributeReturn {
    const [isEditing, setIsEditng] = React.useState(false);
    const [value, setValue] = useWatchValueObserver(observer);
    const handleOnDoubleClick = () => {
        if (cannotEdit) return;
        setIsEditng(true);
    };
    return {isEditing, setIsEditing: setIsEditng, value, setValue, handleOnDoubleClick};
}

export function SimpleNumberAttribute({ title, observer, cannotEdit = false }: SimpleAttributeProps<number>): JSX.Element {
    const {
        isEditing,
        setIsEditing,
        value,
        setValue,
        handleOnDoubleClick
    } = useAttribute({ observer, cannotEdit });

    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <NumberInput
            onDoubleClick={handleOnDoubleClick}
            onBlur={() => setIsEditing(false)}
            aria-label={title}
            value={value}
            onChange={setValue}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing} />
    </Stack>);
}
