import React from "react";

import { ValueChangeMessageProps, ValueObserver } from "~/services/ValueObserver";

export function useWatchValueObserver<T>(observer: ValueObserver<T>): [T, (v: T) => void] {
    const [value, setValue] = React.useState(observer.value);
    React.useEffect(() => {
        const onChangeValue = ({ newValue }: ValueChangeMessageProps<T>) => { setValue(newValue); }
        observer.add(onChangeValue);
        return () => observer.remove(onChangeValue);
    });

    const updateValue = React.useCallback((v: T) => observer.updateValue(v), [observer]);

    return [value, updateValue];
}