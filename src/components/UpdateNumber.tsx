import { useEditPopoverContext } from "~/components/EditPopover";
import React from "react";
import { ActionIcon, NumberInput, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface UpdateNumberProps {
    placeholder?: string;
    updateNumber: (value: number) => void;
}

export function UpdateNumber({ updateNumber, placeholder = "New Value" }: UpdateNumberProps): JSX.Element {
    const { handles } = useEditPopoverContext();
    const [value, setValue] = React.useState<number | ''>('');

    const onCommit = () => {
        updateNumber(value || 0);
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
                styles={{ input: { width: rem(100), textAlign: 'center' } }}
                value={value}
                onKeyDown={handleKeyDown}/>
            <ActionIcon title="Set Value" onClick={onCommit}>
                <IconCheck size="1.75rem"/>
            </ActionIcon>
        </>
    );
}