import { useEditPopoverContext } from "~/components/EditPopover";
import React from "react";
import { ActionIcon, NumberInput, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

export function UpdateNumber({ updateNumber }: { updateNumber: (value: number) => void }): JSX.Element {
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
                placeholder="New Value"
                styles={{ input: { width: rem(90), textAlign: 'center' } }}
                value={value}
                onKeyDown={handleKeyDown}/>
            <ActionIcon title="Set Value" onClick={onCommit}>
                <IconCheck size="1.75rem"/>
            </ActionIcon>
        </>
    );
}