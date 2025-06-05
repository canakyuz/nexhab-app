/**
 * Size constants for consistent component sizing across the app
 */

export const Sizes = {
    // Icon sizes
    icon: {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 28,
        xxl: 32,
        xxxl: 48,
        huge: 64,
        giant: 96,
    },

    // Avatar sizes
    avatar: {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 56,
        xxl: 64,
        xxxl: 80,
        huge: 96,
    },

    // Button heights
    button: {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 56,
    },

    // Input heights
    input: {
        sm: 36,
        md: 44,
        lg: 52,
    },

    // Common component dimensions
    tabBar: {
        height: 60,
        iconSize: 24,
    },

    header: {
        height: 56,
        titleSize: 18,
    },

    card: {
        minHeight: 120,
        headerHeight: 60,
    },

    modal: {
        minHeight: 200,
        maxWidth: 400,
    },

    // Screen dimensions helpers
    screen: {
        // Common breakpoints
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1440,
    },

    // List item heights
    listItem: {
        sm: 44,
        md: 56,
        lg: 72,
    },

    // Badge sizes
    badge: {
        sm: 16,
        md: 20,
        lg: 24,
    },

    // Hit slop for touchable elements
    hitSlop: {
        sm: { top: 8, bottom: 8, left: 8, right: 8 },
        md: { top: 12, bottom: 12, left: 12, right: 12 },
        lg: { top: 16, bottom: 16, left: 16, right: 16 },
    },

    // Minimum touch target size (44pt on iOS, 48dp on Android)
    touchTarget: {
        ios: 44,
        android: 48,
    },
} as const;