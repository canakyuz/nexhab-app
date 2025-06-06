import { StyleSheet, View, ViewStyle, type ViewProps } from 'react-native';

import { BORDER_RADIUS, Colors, Spacing } from '@/design-tokens';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewVariant =
  | 'default'
  | 'card'
  | 'surface'
  | 'error'
  | 'success'
  | 'warning'
  | 'border';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: ThemedViewVariant;
  style?: ViewStyle;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const getVariantStyle = () => {
    switch (variant) {
      case 'card':
        return styles.card;
      case 'surface':
        return styles.surface;
      case 'error':
        return [styles.card, { backgroundColor: Colors.error }];
      case 'success':
        return [styles.card, { backgroundColor: Colors.success }];
      case 'warning':
        return [styles.card, { backgroundColor: Colors.warning }];
      case 'border':
        return styles.border;
      default:
        return undefined;
    }
  };

  return <View style={[{ backgroundColor }, getVariantStyle(), style]} accessible {...otherProps} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: Spacing.card.padding,
  },
  surface: {
    backgroundColor: Colors.lightGray,
    borderRadius: BORDER_RADIUS.md,
    padding: Spacing.md,
  },
  border: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: BORDER_RADIUS.md,
  },
});
