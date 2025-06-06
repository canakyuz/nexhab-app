import { BORDER_RADIUS, Colors, Shadows, Spacing } from '@/design-tokens';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // Eğer gradient kullanılacaksa

export type CardVariant = 'solid' | 'outline' | 'shadow' | 'elevated' | 'gradient' | 'compact';

export type CardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  shadow?: boolean;
  border?: boolean;
  gradientColors?: string[];
  compact?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export const Card = ({
  children,
  variant = 'solid',
  shadow = true,
  border = false,
  gradientColors = [Colors.primary, Colors.secondary],
  compact = false,
  fullWidth = false,
  style,
  accessibilityLabel,
}: CardProps) => {
  // Varyasyonlara göre stil seçimi
  const getCardStyle = () => {
    let base = [styles.card, fullWidth && styles.fullWidth, style];
    if (compact) base.push(styles.compact);
    switch (variant) {
      case 'outline':
        base.push(styles.outline);
        break;
      case 'shadow':
        base.push(Platform.OS === 'ios' ? Shadows.card.ios : Shadows.card.android);
        break;
      case 'elevated':
        base.push(Platform.OS === 'ios' ? Shadows.modal.ios : Shadows.modal.android);
        break;
      case 'gradient':
        // Gradient için özel render gerekir
        break;
      default:
        if (shadow) base.push(Platform.OS === 'ios' ? Shadows.card.ios : Shadows.card.android);
        break;
    }
    if (border) base.push(styles.border);
    return base;
  };

  // Gradient varyasyonu için özel render
  // if (variant === 'gradient') {
  //   return (
  //     <LinearGradient colors={gradientColors} style={getCardStyle()}>
  //       {children}
  //     </LinearGradient>
  //   );
  // }

  return (
    <View style={getCardStyle()} accessibilityRole="summary" accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: Spacing.card.padding,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  compact: {
    padding: Spacing.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
}); 