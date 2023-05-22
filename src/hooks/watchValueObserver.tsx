import React from "react";

import { ValueChangeMessageProps, ReadonlyValueObserver } from "~/services/ValueObserver";

/**
 * Watches the observer and returns the value.
 *
 * @param observer
 * @returns
 */
export function useWatchValueObserver<T>(observer: ReadonlyValueObserver<T>): T {
  const [value, setValue] = React.useState(observer.value);
  React.useEffect(() => {
    setValue(observer.value);
    const onChangeValue = ({ newValue }: ValueChangeMessageProps<T>) => {
      setValue(newValue);
    };
    observer.add(onChangeValue);
    return () => observer.remove(onChangeValue);
  }, [observer]);
  return value;
}

/**
 * Watches an observer that may or may not exist
 *
 * @param defaultValue
 * @param observer
 * @returns
 */
export function useMaybeWatchValueObserver<T>(defaultValue: T, observer?: ReadonlyValueObserver<T>): T {
  const [value, setValue] = React.useState(observer?.value);
  React.useEffect(() => {
    if (!observer) return;
    setValue(observer.value);
    const onChangeValue = ({ newValue }: ValueChangeMessageProps<T>) => {
      setValue(newValue);
    };
    observer.add(onChangeValue);
    return () => observer.remove(onChangeValue);
  }, [observer]);
  return value || defaultValue;
}
