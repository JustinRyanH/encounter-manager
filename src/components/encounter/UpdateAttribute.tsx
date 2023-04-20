import { useEditPopoverContext } from "~/components/EditPopover";
import React from "react";
import { ActionIcon, NumberInput, rem, TextInput } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { s } from "@tauri-apps/api/shell-cbf4da8b";

interface UpdateAttributeProps<T> {
    placeholder?: string;
    updateAttribute: (value: T) => void;
    width?: string;
}

export function UpdateString({ width = '7rem', updateAttribute, placeholder = "New Value" }: UpdateAttributeProps<string>): JSX.Element {
    const { handles } = useEditPopoverContext();
    const [value, setValue] = React.useState<string>('');

    const onCommit = () => {
        updateAttribute(value);
        setValue('');
        handles.close();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handles.close();
            setValue('');
            return;
        }
        if (e.key === 'Enter') {
            onCommit();
        }
    }
    return (
        <>
            <TextInput
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                styles={{ input: { width, textAlign: 'center' } }}
                value={value}
                onKeyDown={handleKeyDown}/>
            <ActionIcon title="Set Value" onClick={onCommit}>
                <IconCheck size="1.75rem"/>
            </ActionIcon>
        </>
    );
}

export function UpdateNumber({ width = '6rem', updateAttribute, placeholder = "New Value" }: UpdateAttributeProps<number>): JSX.Element {
    const { handles } = useEditPopoverContext();
    const [value, setValue] = React.useState<number | ''>('');

    const onCommit = () => {
        updateAttribute(value || 0);
        setValue('');
        handles.close();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            handles.close();
            setValue('');
            return;
        }
        if (e.key === 'Enter') {
            onCommit();
        }
    }
    return (
        <>
            <NumberInput
                hideControls
                onChange={setValue}
                placeholder={placeholder}
                styles={{ input: { width, textAlign: 'center' } }}
                value={value}
                onKeyDown={handleKeyDown}/>
            <ActionIcon title="Set Value" onClick={onCommit}>
                <IconCheck size="1.75rem"/>
            </ActionIcon>
        </>
    );
}