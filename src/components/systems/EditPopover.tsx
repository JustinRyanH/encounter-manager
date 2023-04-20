import {DisclousreHandles} from "~/components/interfaces";
import {useClickOutside, useDisclosure} from "@mantine/hooks";
import {Flex, Popover, UnstyledButton} from "@mantine/core";
import React from "react";

interface EditPopoverProps {
    children: React.ReactNode;
    titleComponent?: React.ReactNode;
}

interface EditPopoverContext {
    opened: boolean;
    handles: DisclousreHandles;
}

const DefaultPopoverContext: EditPopoverContext = {
    opened: false,
    handles: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close: () => {
        }
    }
};
const EditPopoverContext = React.createContext<EditPopoverContext>(DefaultPopoverContext);

export function useEditPopoverContext(): EditPopoverContext {
    return React.useContext(EditPopoverContext) || DefaultPopoverContext;
}

export function EditPopover({children, titleComponent}: EditPopoverProps): JSX.Element {
    const [opened, handles] = useDisclosure(false);
    const ref = useClickOutside(() => handles.close(), ['mousedown', 'touchstart']);

    return (
        <EditPopoverContext.Provider value={{opened, handles}}>
            <Popover
                position="top"
                withArrow
                trapFocus
                returnFocus
                opened={opened}
            >
                <Popover.Target>
                    <UnstyledButton onClick={handles.open}>
                        {titleComponent}
                    </UnstyledButton>
                </Popover.Target>
                <Popover.Dropdown>
                    <Flex ref={ref} align="center" gap="xs">
                        {children}
                    </Flex>
                </Popover.Dropdown>
            </Popover>
        </EditPopoverContext.Provider>
    )
}