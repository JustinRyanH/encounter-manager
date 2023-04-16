import {Divider, NumberInput, rem, Stack, Title} from "@mantine/core";
import React from "react";

import {SimpleAttributeProps} from "./SimpleAttributeProps";
import {useAttribute} from "~/hooks/UseAttribute";

export function SimpleNumberAttribute({ title, observer, cannotEdit = false, width }: SimpleAttributeProps<number>): JSX.Element {
    const {
        handleOnBlur,
        handleOnDoubleClick,
        isEditing,
        setValue,
        value,
    } = useAttribute({ observer, cannotEdit });

    return (<Stack spacing="sm" align="center">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <NumberInput
            onDoubleClick={handleOnDoubleClick}
            onBlur={handleOnBlur}
            aria-label={title}
            value={value}
            onChange={(v) => setValue(v || -1)}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center", width: width ?? rem(width)  } }}
            readOnly={!isEditing} />
    </Stack>);
}
