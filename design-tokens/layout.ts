/**
 * Layout constants for consistent positioning and structure across the app
 */

export const layout = {
    // Z-index values for proper layering
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1010,
        overlay: 1020,
        modal: 1030,
        popover: 1040,
        tooltip: 1050,
        toast: 1060,
        max: 9999,
    },

    // Flex utilities
    flex: {
        center: {
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        centerX: {
            alignItems: 'center' as const,
        },
        centerY: {
            justifyContent: 'center' as const,
        },
        spaceBetween: {
            justifyContent: 'space-between' as const,
        },
        spaceAround: {
            justifyContent: 'space-around' as const,
        },
        spaceEvenly: {
            justifyContent: 'space-evenly' as const,
        },
    },

    // Position utilities
    position: {
        absolute: 'absolute' as const,
        relative: 'relative' as const,
    },

    // Common layout patterns
    screen: {
        container: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        safe: {
            flex: 1,
            paddingHorizontal: 16,
        },
        centered: {
            flex: 1,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
    },

    // Container max widths
    container: {
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1280,
        full: '100%',
    },

    // Grid system
    grid: {
        columns: 12,
        gutter: 16,
        margin: 16,
    },

    // Common component layouts
    header: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
    },

    footer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        alignItems: 'center' as const,
    },

    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },

    list: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    listItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    },

    // Modal layouts
    modal: {
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            padding: 20,
        },
        content: {
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            minWidth: 280,
            maxWidth: '90%',
        },
    },

    // Form layouts
    form: {
        container: {
            padding: 16,
        },
        field: {
            marginBottom: 16,
        },
        group: {
            marginBottom: 24,
        },
        actions: {
            flexDirection: 'row' as const,
            justifyContent: 'flex-end' as const,
            marginTop: 24,
            gap: 12,
        },
    },

    // Aspect ratios
    aspectRatio: {
        square: 1,
        video: 16 / 9,
        photo: 4 / 3,
        banner: 3 / 1,
    },
} as const;