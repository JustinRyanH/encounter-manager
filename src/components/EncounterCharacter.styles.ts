import { createStyles, keyframes } from "@mantine/core";

export const linearGradiantMove = keyframes({
    '100%': { backgroundPosition: '4px 0, -4px 100%, 0 -4px, 100% 4px' },
});

export const useStyles = createStyles((theme) => ({
    inPlay: {
        background: '' +
            `linear-gradient(90deg, ${theme.colors.orange} 50%, transparent 0) repeat-x,` +
            `linear-gradient(90deg, ${theme.colors.orange} 50%, transparent 0) repeat-x,` +
            `linear-gradient(0deg, ${theme.colors.orange} 50%, transparent 0) repeat-y,` +
            `linear-gradient(0deg, ${theme.colors.orange} 50%, transparent 0) repeat-y`,
        backgroundSize: '4px 2px, 4px 2px, 2px 4px, 2px 4px',
        backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
        animation: `${linearGradiantMove} .3s linear infinite`,
    },
    accordion: {
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,

        '&:not(:first-child)': {
            marginTop: theme.spacing.lg,
        }
    },
}));