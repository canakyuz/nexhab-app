import { BORDER_RADIUS, Spacing, Typography } from '@/design-tokens';
import { ButtonSize, ButtonVariant } from './button.types';

export function getButtonContainerStyle(variant: ButtonVariant, size: ButtonSize, theme: any, fullWidth?: boolean, disabled?: boolean) {
  const base = {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row' as const,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 44,
    paddingHorizontal: size === 'sm' ? Spacing.md : size === 'lg' ? Spacing.xl : Spacing.lg,
    paddingVertical: size === 'sm' ? Spacing.sm : size === 'lg' ? Spacing.lg : Spacing.md,
    backgroundColor: theme.primary,
    opacity: disabled ? 0.6 : 1,
    alignSelf: fullWidth ? 'stretch' : 'auto',
  };
  switch (variant) {
    case 'secondary':
      return { ...base, backgroundColor: theme.secondary };
    case 'outline':
      return { ...base, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary };
    case 'ghost':
      return { ...base, backgroundColor: 'transparent', borderWidth: 0 };
    default:
      return base;
  }
}

export function getButtonTextStyle(variant: ButtonVariant, theme: any) {
  const base = {
    ...Typography.styles.button,
    color: theme.white,
  };
  switch (variant) {
    case 'outline':
    case 'ghost':
      return { ...base, color: theme.primary };
    case 'secondary':
      return { ...base, color: theme.white };
    default:
      return base;
  }
} 