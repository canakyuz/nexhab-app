import { BORDER_RADIUS, Colors, Shadows, Spacing, Typography } from '@/design-tokens';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // Eğer gradient kullanılacaksa

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export const Button = ({
  title,
  onPress,
  variant = 'solid',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) => {
  // Varyasyonlara göre stil seçimi
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [
          styles.button,
          styles.outline,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ];
      case 'ghost':
        return [
          styles.button,
          styles.ghost,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ];
      case 'gradient':
        return [
          styles.button,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ];
      default:
        return [
          styles.button,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ];
    }
  };

  // Gradient varyasyonu için özel render
  // if (variant === 'gradient') {
  //   return (
  //     <LinearGradient colors={[Colors.primary, Colors.secondary]} style={getButtonStyle()}>
  //       <ButtonContent />
  //     </LinearGradient>
  //   );
  // }

  const ButtonContent = () => (
    <View style={styles.content}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.textOutline,
          variant === 'ghost' && styles.textGhost,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );

  return (
    <Pressable
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: Colors.gray, borderless: false }}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? Colors.white : Colors.primary} />
      ) : (
        <ButtonContent />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.button.paddingVertical,
    paddingHorizontal: Spacing.button.paddingHorizontal,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
    ...(Platform.OS === 'ios' ? Shadows.button.ios : Shadows.button.android),
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
  fullWidth: {
    alignSelf: 'stretch',
  },
  text: {
    color: Colors.white,
    ...Typography.styles.button,
  },
  textOutline: {
    color: Colors.primary,
  },
  textGhost: {
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginHorizontal: 2,
  },
});
