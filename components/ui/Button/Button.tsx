import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { getButtonContainerStyle, getButtonTextStyle } from './button.styles';
import { ButtonProps } from './button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  fullWidth,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const theme = useThemeColor();
  const containerStyle = getButtonContainerStyle(variant, size, theme, fullWidth, disabled);
  const labelStyle = getButtonTextStyle(variant, theme);

  return (
    <Pressable
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {leftIcon && <View style={{ marginRight: 4 }}>{leftIcon}</View>}
          <Text style={[labelStyle, textStyle]} numberOfLines={1}>{children}</Text>
          {rightIcon && <View style={{ marginLeft: 4 }}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}; 