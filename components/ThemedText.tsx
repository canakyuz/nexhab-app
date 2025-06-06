import { Colors, Typography } from '@/design-tokens';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextType =
  | 'default'
  | 'title'
  | 'subtitle'
  | 'semiBold'
  | 'link'
  | 'caption'
  | 'error'
  | 'success'
  | 'warning';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemedTextType;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getTypeStyle = () => {
    switch (type) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'semiBold':
        return styles.semiBold;
      case 'link':
        return styles.link;
      case 'caption':
        return styles.caption;
      case 'error':
        return [styles.caption, { color: Colors.error }];
      case 'success':
        return [styles.caption, { color: Colors.success }];
      case 'warning':
        return [styles.caption, { color: Colors.warning }];
      default:
        return styles.default;
    }
  };

  return (
    <Text
      style={[{ color }, getTypeStyle(), style]}
      accessible
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...Typography.styles.body,
  },
  semiBold: {
    ...Typography.styles.body,
    fontWeight: '600',
  },
  title: {
    ...Typography.styles.h1,
  },
  subtitle: {
    ...Typography.styles.h4,
  },
  link: {
    ...Typography.styles.link,
    color: Colors.primary,
  },
  caption: {
    ...Typography.styles.caption,
  },
});
