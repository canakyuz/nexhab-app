/**
 * Spacing constants for consistent layout across the app
 */

export const Spacing = {
    // Base spacing units
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,

    // Specific use cases
    screen: {
        horizontal: 20,
        vertical: 24,
    },

    container: {
        padding: 16,
        margin: 16,
    },

    card: {
        padding: 16,
        margin: 8,
        gap: 12,
    },

    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        margin: 8,
    },

    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        margin: 8,
    },

    icon: {
        small: 8,
        medium: 12,
        large: 16,
    },

    list: {
        itemPadding: 16,
        sectionPadding: 24,
        gap: 8,
    },

    tab: {
        padding: 12,
        iconPadding: 8,
    },

    modal: {
        padding: 24,
        margin: 20,
    },
} as const;