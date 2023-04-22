import { notifications } from "@mantine/notifications";

/**
 * Takes an error string and displays it in a notification
 * @param errors
 * @param title
 * @return true if there are errors
 */
export function notifyErrors({ errors, title = 'Error' }: { errors: string, title?: string, }): boolean {
    if (!errors) return false;
    notifications.show({ title, message: errors, color: 'red' });
    return true
}
