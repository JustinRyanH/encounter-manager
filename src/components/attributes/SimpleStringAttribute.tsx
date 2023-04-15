import { Divider, Stack, TextInput, Title } from "@mantine/core";
import React from "react";
import { useWatchValueObserver } from "../../hooks/watchValueObserver";
import { SimpleStringAttributeProps } from "../CharacterInInitative";

export function SimpleStringAttribute({ title, observer }: SimpleStringAttributeProps): JSX.Element {
    const [isEditing, setIsEditng] = React.useState(false);
    const [value, setValue] = useWatchValueObserver(observer);
    return (<Stack spacing="sm">
        <Title order={3} align="center" transform="uppercase">{title}</Title>
        <Divider />
        <TextInput
            onDoubleClick={() => setIsEditng(true)}
            onBlur={() => setIsEditng(false)}
            aria-label={title}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder={title}
            radius="md"
            styles={{ input: { textAlign: "center" } }}
            readOnly={!isEditing} />
    </Stack>);
}
