/**
 * Typography constants for consistent text styling across the app
 */

export const Typography = {
    // Font sizes
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        heading: 28,
        title: 32,
        hero: 40,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
        loose: 1.8,
    },

    // Font weights
    fontWeight: {
        light: '300' as const,
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        heavy: '800' as const,
    },

    // Letter spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },

    // Text styles
    styles: {
        // Headers
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            lineHeight: 38,
        },
        h2: {
            fontSize: 28,
            fontWeight: '600' as const,
            lineHeight: 34,
        },
        h3: {
            fontSize: 24,
            fontWeight: '600' as const,
            lineHeight: 30,
        },
        h4: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 26,
        },
        h5: {
            fontSize: 18,
            fontWeight: '500' as const,
            lineHeight: 24,
        },
        h6: {
            fontSize: 16,
            fontWeight: '500' as const,
            lineHeight: 22,
        },

        // Body text
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        bodyLarge: {
            fontSize: 18,
            fontWeight: '400' as const,
            lineHeight: 26,
        },

        // Special text
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        overline: {
            fontSize: 12,
            fontWeight: '500' as const,
            lineHeight: 16,
            letterSpacing: 1,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 20,
        },
        link: {
            fontSize: 16,
            fontWeight: '500' as const,
            lineHeight: 22,
        },
    },

    progressTitle: { fontSize: 18, fontWeight: '700' },
    progressValue: { fontSize: 18, fontWeight: '700' },
    progressLabel: { fontSize: 13, fontWeight: '400' },
} as const;