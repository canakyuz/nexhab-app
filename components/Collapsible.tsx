import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BORDER_RADIUS, Colors, Spacing } from '@/design-tokens';
import { useColorScheme } from '@/hooks/useColorScheme';

export type CollapsibleVariant = 'default' | 'bordered' | 'dense';

export type CollapsibleProps = PropsWithChildren & {
  title: string;
  variant?: CollapsibleVariant;
  style?: ViewStyle;
};

export function Collapsible({ children, title, variant = 'default', style }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  const getContainerStyle = () => {
    let base = [styles.container, style];
    if (variant === 'bordered') base.push(styles.bordered);
    if (variant === 'dense') base.push(styles.dense);
    return base;
  };

  return (
    <ThemedView style={getContainerStyle()}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: isOpen }}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    padding: Spacing.sm,
  },
  bordered: {
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  dense: {
    padding: Spacing.xs,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
