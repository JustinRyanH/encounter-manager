import { ValueObserver } from "~/services/ValueObserver";


export interface SimpleAttributeProps<T> {
    title: string;
    observer: ValueObserver<T>;
    cannotEdit?: boolean;
    width?: number;
}
