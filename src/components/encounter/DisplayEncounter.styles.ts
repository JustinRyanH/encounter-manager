import { createStyles, keyframes } from "@mantine/core";

export const animatedStripes = keyframes({
    '100%': {
        backgroundPosition: '100% 100%',
    },
});

export const useStyles = createStyles((theme) => {
    const backgroundDarkColor = theme.colors.danger[0];
    const backgroundDangerColor = theme.colors.danger[2];
    return ({
        item: {
            padding: theme.spacing.xs,
            border: `1px solid ${theme.colors.dark[5]}`,
            transition: 'background-color 0.8s ease-in-out, border 0.8s ease-in-out',

            '&[data-in-play="true"]': {
                border: `1px solid ${theme.colors.danger[1]}`,
                backgroundColor: backgroundDarkColor,
                backgroundImage: `repeating-linear-gradient(45deg, ${backgroundDangerColor}, ${backgroundDangerColor} 1rem, ${backgroundDarkColor} 1rem, ${backgroundDarkColor} 2rem)`,
                backgroundSize: '200% 200%',
                animation: `${animatedStripes} 20s linear infinite`,
            }
        },
        content: {
            padding: `${theme.spacing.xs} 0 0 0`,
        },
        accordion: {
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,

            '&:not(:first-child)': {
                marginTop: theme.spacing.lg,
            }
        },
    });
});