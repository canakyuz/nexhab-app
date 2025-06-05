/**
 * Animation constants for consistent motion across the app
 */

export const Animations = {
    // Duration values (in milliseconds)
    duration: {
        instant: 0,
        fast: 150,
        normal: 250,
        slow: 350,
        slower: 500,
        slowest: 750,
    },

    // Easing curves
    easing: {
        linear: 'linear' as const,
        easeIn: 'ease-in' as const,
        easeOut: 'ease-out' as const,
        easeInOut: 'ease-in-out' as const,

        // Custom bezier curves for more natural animations
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' as const,
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' as const,
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)' as const,
    },

    // Common animation types
    fade: {
        duration: 250,
        easing: 'ease-in-out' as const,
    },

    slide: {
        duration: 300,
        easing: 'ease-out' as const,
    },

    scale: {
        duration: 200,
        easing: 'ease-in-out' as const,
    },

    bounce: {
        duration: 400,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' as const,
    },

    // Component specific animations
    button: {
        press: {
            duration: 100,
            scale: 0.95,
        },
        loading: {
            duration: 1000,
            easing: 'linear' as const,
        },
    },

    modal: {
        enter: {
            duration: 300,
            easing: 'ease-out' as const,
        },
        exit: {
            duration: 200,
            easing: 'ease-in' as const,
        },
    },

    tab: {
        switch: {
            duration: 200,
            easing: 'ease-in-out' as const,
        },
    },

    toast: {
        enter: {
            duration: 250,
            easing: 'ease-out' as const,
        },
        exit: {
            duration: 200,
            easing: 'ease-in' as const,
        },
    },

    // Spring animation configs (for react-native-reanimated)
    spring: {
        gentle: {
            damping: 20,
            stiffness: 90,
        },
        bouncy: {
            damping: 10,
            stiffness: 100,
        },
        slow: {
            damping: 20,
            stiffness: 60,
        },
        fast: {
            damping: 15,
            stiffness: 200,
        },
    },

    // Layout animation configs
    layout: {
        duration: 250,
        create: {
            type: 'spring' as const,
            property: 'opacity' as const,
            springDamping: 0.7,
        },
        update: {
            type: 'spring' as const,
            springDamping: 0.7,
        },
        delete: {
            type: 'easeInEaseOut' as const,
            property: 'opacity' as const,
        },
    },
} as const;