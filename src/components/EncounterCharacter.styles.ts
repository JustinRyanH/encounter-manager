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
            border: `1px solid ${theme.colors.dark[5]}`,
            transition: 'background 0.5s ease-in-out, border 0.5s ease-in-out, background-image 0.5s ease-in-out background-size 0.5s ease-in-out',

            '&[data-in-play="true"]': {
                border: `1px solid ${theme.colors.danger[1]}`,
                backgroundColor: backgroundDarkColor,
                backgroundImage: `repeating-linear-gradient(45deg, ${backgroundDangerColor}, ${backgroundDangerColor} 1rem, ${backgroundDarkColor} 1rem, ${backgroundDarkColor} 2rem)`,
                backgroundSize: '200% 200%',
                transition: 'background 0.5s ease-in-out, border 0.5s ease-in-out, backgroundImage 2s ease',
                animation: `${animatedStripes} 20s linear infinite`,
            }
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