import { ThemedText } from '@/components/ThemedText';
import { Spacing, Typography } from '@/design-tokens';
import { useEffect } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export type HelloWaveProps = {
  size?: number;
  style?: TextStyle;
  accessibilityLabel?: string;
};

export function HelloWave({ size = 28, style, accessibilityLabel }: HelloWaveProps) {
  const rotationAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
      4
    );
  }, [rotationAnimation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle} accessible accessibilityLabel={accessibilityLabel || 'El sallama'}>
      <ThemedText style={[styles.text, { fontSize: size, lineHeight: size + 4 }, style]}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    ...Typography.styles.h2,
    marginTop: -Spacing.xs,
  },
});
