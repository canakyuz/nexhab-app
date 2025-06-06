/**
 * Shadow constants for consistent elevation across the app
 */

export const Shadows = {
    // iOS shadows
    ios: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
        },
        xxl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.18,
            shadowRadius: 24,
        },
    },

    // Android shadows (elevation)
    android: {
        none: { elevation: 0 },
        sm: { elevation: 2 },
        md: { elevation: 4 },
        lg: { elevation: 8 },
        xl: { elevation: 12 },
        xxl: { elevation: 16 },
    },

    // Component specific shadows
    card: {
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
        android: { elevation: 4 },
    },

    modal: {
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 24,
        },
        android: { elevation: 16 },
    },

    fab: {
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        android: { elevation: 8 },
    },

    button: {
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        },
        android: { elevation: 2 },
    },

    tabBar: {
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
        android: { elevation: 8 },
    },
} as const;