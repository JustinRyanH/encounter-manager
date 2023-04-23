import React, { FocusEventHandler, MouseEventHandler } from "react";

interface EditableAttributeReturn {
    handleOnBlur: FocusEventHandler<HTMLElement>;
    handleOnDoubleClick: MouseEventHandler<HTMLElement>;
    isEditing: boolean;
}

export function useEditableAttribute(cannotEdit = false): EditableAttributeReturn {
    const [isEditing, setIsEditing] = React.useState(false);
    const handleOnDoubleClick = () => {
        if (cannotEdit) return;
        setIsEditing(true);
    };
    const handleOnBlur = () => setIsEditing(false);

    return {
        isEditing,
        handleOnDoubleClick,
        handleOnBlur
    };
}