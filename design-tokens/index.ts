/**
 * Central export file for all design system constants
 * Import all constants from this file for easy access
 */

export * from './animations';
export * from './border';
export * from './borderRadius';
export * from './colors';
export * from './layout';
export * from './shadows';
export * from './sizes';
export * from './spacing';
export * from './typography';

// Type exports for better TypeScript support
export type ColorScheme = 'light' | 'dark';
export type SpacingKey = keyof typeof import('./spacing').Spacing;
export type TypographyKey = keyof typeof import('./typography').Typography;
export type BorderKey = keyof typeof import('./border').Border;
export type ShadowKey = keyof typeof import('./shadows').Shadows;
export type SizeKey = keyof typeof import('./sizes').Sizes;
export type AnimationKey = keyof typeof import('./animations').Animations;
export type LayoutKey = keyof typeof import('./layout').layout;