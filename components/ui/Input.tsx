import { BORDER_RADIUS, Colors, Spacing, Typography } from '@/design-tokens';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';

export type InputVariant = 'outline' | 'filled';

export type InputProps = TextInputProps & {
  variant?: InputVariant;
  error?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  accessibilityLabel?: string;
};

export const Input = ({
  variant = 'filled',
  error,
  success,
  leftIcon,
  rightIcon,
  fullWidth,
  style,
  inputStyle,
  accessibilityLabel,
  ...props
}: InputProps) => {
  const getInputStyle = () => {
    let base = [styles.input, fullWidth && styles.fullWidth, style];
    if (variant === 'outline') base.push(styles.outline);
    if (error) base.push(styles.error);
    if (success) base.push(styles.success);
    return base;
  };

  return (
    <View style={styles.container}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <TextInput
        style={[...getInputStyle(), inputStyle]}
        placeholderTextColor={Colors.gray}
        accessible
        accessibilityLabel={accessibilityLabel}
        {...props}
      />
      {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.input,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: Spacing.input.paddingVertical,
    paddingHorizontal: Spacing.input.paddingHorizontal,
    color: Colors.darkGray,
    ...Typography.styles.body,
    minHeight: 44,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  error: {
    borderColor: Colors.error,
  },
  success: {
    borderColor: Colors.success,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  icon: {
    marginHorizontal: 4,
  },
}); 