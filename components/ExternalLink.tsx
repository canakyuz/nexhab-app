import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors, Typography } from '@/design-tokens';
import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps, ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export type ExternalLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: Href & string;
  underline?: boolean;
  color?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityLabel?: string;
};

export function ExternalLink({
  href,
  underline = true,
  color = Colors.primary,
  leftIcon,
  rightIcon,
  children,
  accessibilityLabel,
  style,
  ...rest
}: ExternalLinkProps) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      style={[styles.link, { color, textDecorationLine: underline ? 'underline' : 'none' }, style]}
    >
      <View style={styles.content}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <Text style={[styles.text, { color }]}>{children}</Text>
        {rightIcon ? (
          <View style={styles.icon}>{rightIcon}</View>
        ) : (
          <IconSymbol name="arrow.up.right" size={14} color={color} style={styles.icon} />
        )}
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    ...Typography.styles.link,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    ...Typography.styles.link,
  },
  icon: {
    marginHorizontal: 2,
  },
});
