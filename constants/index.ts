/**
 * Central export file for all design system constants
 * Import all constants from this file for easy access
 */

export { Colors } from './Colors';
export { Spacing } from './Spacing';
export { Typography } from './Typography';
export { Border } from './Border';
export { Shadows } from './Shadows';
export { Sizes } from './Sizes';
export { Animations } from './Animations';
export { Layout } from './Layout';

// Type exports for better TypeScript support
export type ColorScheme = 'light' | 'dark';
export type SpacingKey = keyof typeof import('./Spacing').Spacing;
export type TypographyKey = keyof typeof import('./Typography').Typography;
export type BorderKey = keyof typeof import('./Border').Border;
export type ShadowKey = keyof typeof import('./Shadows').Shadows;
export type SizeKey = keyof typeof import('./Sizes').Sizes;
export type AnimationKey = keyof typeof import('./Animations').Animations;
export type LayoutKey = keyof typeof import('./Layout').Layout;