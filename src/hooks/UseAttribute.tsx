import React, {FocusEventHandler, MouseEventHandler} from "react";
import {useWatchValueObserver} from "~/hooks/watchValueObserver";
import {ValueObserver} from "~/services/ValueObserver";

interface UserAttributeProps<T> {
    observer: ValueObserver<T>;
    cannotEdit?: boolean;
}

interface EditableAttributeReturn {
    handleOnBlur: FocusEventHandler<HTMLElement>;
    handleOnDoubleClick: MouseEventHandler<HTMLElement>;
    isEditing: boolean;
}

interface UserAttributeReturn<T> extends  EditableAttributeReturn{
    setValue: (v: T) => void;
    value: T;
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

export function useAttribute<T>({observer, cannotEdit}: UserAttributeProps<T>): UserAttributeReturn<T> {
    const {
        isEditing,
        handleOnDoubleClick,
        handleOnBlur
    } = useEditableAttribute(cannotEdit);
    const [value, setValue] = useWatchValueObserver<T>(observer);

    return {isEditing, value, setValue, handleOnDoubleClick, handleOnBlur};
}