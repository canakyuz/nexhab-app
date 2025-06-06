import { BORDER_RADIUS, Colors, Spacing, Typography } from '@/design-tokens';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export type BadgeVariant = 'solid' | 'outline' | 'ghost' | 'success' | 'error' | 'warning';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export const Badge = ({
  label,
  variant = 'solid',
  style,
  textStyle,
  accessibilityLabel,
}: BadgeProps) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.badge, styles.outline, style];
      case 'ghost':
        return [styles.badge, styles.ghost, style];
      case 'success':
        return [styles.badge, styles.success, style];
      case 'error':
        return [styles.badge, styles.error, style];
      case 'warning':
        return [styles.badge, styles.warning, style];
      default:
        return [styles.badge, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.textOutline, textStyle];
      case 'ghost':
        return [styles.text, styles.textGhost, textStyle];
      case 'success':
        return [styles.text, styles.textSuccess, textStyle];
      case 'error':
        return [styles.text, styles.textError, textStyle];
      case 'warning':
        return [styles.text, styles.textWarning, textStyle];
      default:
        return [styles.text, textStyle];
    }
  };

  return (
    <View style={getBadgeStyle()} accessible accessibilityLabel={accessibilityLabel || label}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 20,
    alignSelf: 'flex-start',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  success: {
    backgroundColor: Colors.success,
  },
  error: {
    backgroundColor: Colors.error,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  text: {
    color: Colors.white,
    ...Typography.styles.caption,
    fontWeight: '600',
  },
  textOutline: {
    color: Colors.primary,
  },
  textGhost: {
    color: Colors.primary,
  },
  textSuccess: {
    color: Colors.white,
  },
  textError: {
    color: Colors.white,
  },
  textWarning: {
    color: Colors.white,
  },
}); 