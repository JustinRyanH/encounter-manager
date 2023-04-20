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
        inPlay: {
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            background: `repeating-linear-gradient(45deg, ${backgroundDangerColor}, ${backgroundDangerColor} 1rem, ${backgroundDarkColor} 1rem, ${backgroundDarkColor} 2rem)`,
            backgroundSize: '200% 200%',
            animation: `${animatedStripes} 20s linear infinite`,
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