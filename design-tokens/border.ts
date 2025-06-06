/**
 * Border and border radius constants for consistent styling across the app
 */

export const Border = {
    // Border radius
    radius: {
        none: 0,
        xs: 4,
        sm: 6,
        md: 8,
        lg: 12,
        xl: 16,
        xxl: 20,
        xxxl: 24,
        full: 9999, // For circular elements
    },

    // Border widths
    width: {
        none: 0,
        thin: 0.5,
        normal: 1,
        thick: 2,
        heavy: 3,
    },

    // Specific component styles
    button: {
        radius: 8,
        width: 1,
    },

    card: {
        radius: 12,
        width: 1,
    },

    input: {
        radius: 8,
        width: 1,
    },

    modal: {
        radius: 16,
        width: 0,
    },

    avatar: {
        radius: 9999, // Circular
        width: 2,
    },

    badge: {
        radius: 12,
        width: 0,
    },

    tab: {
        radius: 8,
        width: 0,
    },

    // Common border styles
    styles: {
        solid: 'solid' as const,
        dashed: 'dashed' as const,
        dotted: 'dotted' as const,
    },
} as const;