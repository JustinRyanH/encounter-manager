import React from "react";

import { ValueChangeMessageProps, ValueObserver } from "~/services/ValueObserver";

export function useWatchValueObserver<T>(observer: ValueObserver<T>, updateOverride?: (v: T) => void): [T, (v: T) => void] {
    const [value, setValue] = React.useState(observer.value);
    React.useEffect(() => {
        const onChangeValue = ({ newValue }: ValueChangeMessageProps<T>) => { setValue(newValue); }
        observer.add(onChangeValue);
        return () => observer.remove(onChangeValue);
    });

    const updateValue = React.useCallback((v: T) => {
        if (updateOverride) return updateOverride(v);
        return observer.updateValue(v);
    }, [observer, updateOverride]);

    return [value, updateValue];
}