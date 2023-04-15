import { Divider, Stack, TextInput, Title } from "@mantine/core";
import React from "react";

import { SimpleAttributeProps } from "./SimpleAttributeProps";
import {useAttribute} from "~/hooks/UseAttribute";


export function SimpleStringAttribute({ title, observer, cannotEdit }: SimpleAttributeProps<string>): JSX.Element {
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
        <TextInput
            onDoubleClick={handleOnDoubleClick}
            onBlur={handleOnBlur}
            aria-label={title}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing} />
    </Stack>);
}
