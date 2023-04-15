import React, {FocusEventHandler, MouseEventHandler} from "react";
import {useWatchValueObserver} from "~/hooks/watchValueObserver";
import {ValueObserver} from "~/services/ValueObserver";

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

export function useAttribute<T>({observer, cannotEdit}: UserAttributeProps<T>): UserAttributeReturn<T> {
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = useWatchValueObserver<T>(observer);
    const handleOnDoubleClick = () => {
        if (cannotEdit) return;
        setIsEditing(true);
    };
    const handleOnBlur = () => setIsEditing(false);

    return {isEditing, setIsEditing: setIsEditing, value, setValue, handleOnDoubleClick, handleOnBlur};
}