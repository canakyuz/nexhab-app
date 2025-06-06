import { BORDER_RADIUS, Spacing } from '@/design-tokens';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { ViewStyle } from 'react-native';

export type HapticTabProps = BottomTabBarButtonProps & {
  feedbackStyle?: keyof typeof Haptics.ImpactFeedbackStyle;
  style?: ViewStyle;
};

export function HapticTab({ feedbackStyle = 'Light', style, ...props }: HapticTabProps) {
  return (
    <PlatformPressable
      {...props}
      style={[{ borderRadius: BORDER_RADIUS.md, padding: Spacing.sm }, style]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle[feedbackStyle]);
        }
        props.onPressIn?.(ev);
      }}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
    />
  );
}
