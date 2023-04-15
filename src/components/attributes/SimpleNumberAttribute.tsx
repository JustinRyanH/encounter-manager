import { Divider, NumberInput, Stack, Title } from "@mantine/core";
import React, {FocusEventHandler, MouseEventHandler} from "react";

import { useWatchValueObserver } from "~/hooks/watchValueObserver";
import { ValueObserver } from "~/services/ValueObserver";

import { SimpleAttributeProps } from "./SimpleAttributeProps";

interface UserAttributeProps<T> {
    observer: ValueObserver<T>;
    cannotEdit?: boolean;
}

interface UserAttributeReturn<T> {
    handleOnBlur: FocusEventHandler<HTMLElement>;
    handleOnDoubleClick: MouseEventHandler<HTMLElement>;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    setValue: (v: T) => void;
    value: T;
}

function useAttribute<T>({ observer, cannotEdit }: UserAttributeProps<T>): UserAttributeReturn<T> {
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = useWatchValueObserver<T>(observer);
    const handleOnDoubleClick = () => {
        if (cannotEdit) return;
        setIsEditing(true);
    };
    const handleOnBlur = () => setIsEditing(false);

    return {isEditing, setIsEditing: setIsEditing, value, setValue, handleOnDoubleClick, handleOnBlur};
}

export function SimpleNumberAttribute({ title, observer, cannotEdit = false }: SimpleAttributeProps<number>): JSX.Element {
    const {
        handleOnBlur,
        handleOnDoubleClick,
        isEditing,
        setValue,
        value,
    } = useAttribute({ observer, cannotEdit });

    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <NumberInput
            onDoubleClick={handleOnDoubleClick}
            onBlur={handleOnBlur}
            aria-label={title}
            value={value}
            onChange={(v) => setValue(v || -1)}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing} />
    </Stack>);
}
