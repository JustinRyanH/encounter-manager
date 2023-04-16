import React from "react";

import { ValueChangeMessageProps, ValueObserver, ReadonlyValueObserver } from "~/services/ValueObserver";

export function useWatchValueObserver<T>(observer: ReadonlyValueObserver<T>): T {
    const [value, setValue] = React.useState(observer.value);
    React.useEffect(() => {
        const onChangeValue = ({ newValue }: ValueChangeMessageProps<T>) => { setValue(newValue); }
        observer.add(onChangeValue);
        return () => observer.remove(onChangeValue);
    });
    return value;
}