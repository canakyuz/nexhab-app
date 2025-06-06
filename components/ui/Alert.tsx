import { BORDER_RADIUS, Colors, Spacing, Typography } from '@/design-tokens';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export type AlertProps = {
  message: string;
  variant?: AlertVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export const Alert = ({
  message,
  variant = 'info',
  style,
  textStyle,
  accessibilityLabel,
}: AlertProps) => {
  const getAlertStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.alert, styles.success, style];
      case 'warning':
        return [styles.alert, styles.warning, style];
      case 'error':
        return [styles.alert, styles.error, style];
      default:
        return [styles.alert, styles.info, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'success':
        return [styles.text, styles.textSuccess, textStyle];
      case 'warning':
        return [styles.text, styles.textWarning, textStyle];
      case 'error':
        return [styles.text, styles.textError, textStyle];
      default:
        return [styles.text, styles.textInfo, textStyle];
    }
  };

  return (
    <View style={getAlertStyle()} accessible accessibilityLabel={accessibilityLabel || message}>
      <Text style={getTextStyle()}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    borderRadius: BORDER_RADIUS.md,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  error: {
    backgroundColor: Colors.error,
  },
  text: {
    ...Typography.styles.body,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  textInfo: {
    color: Colors.primary,
  },
  textSuccess: {
    color: Colors.white,
  },
  textWarning: {
    color: Colors.white,
  },
  textError: {
    color: Colors.white,
  },
}); 