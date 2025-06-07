import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';
import { Platform, View, Text } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { cn } from '~/lib/utils';

// Create animated components
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

function Progress({
  className,
  value,
  indicatorClassName,
  ...props
}: ProgressPrimitive.RootProps & {
  ref?: React.RefObject<ProgressPrimitive.RootRef>;
  indicatorClassName?: string;
}) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/40', className)}
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} />
    </ProgressPrimitive.Root>
  );
}

export { Progress };

function Indicator({ value, className }: { value: number | undefined | null; className?: string }) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { damping: 15, stiffness: 120, overshootClamping: true }
      ),
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn('h-full w-full flex-1 bg-primary rounded-full shadow-sm shadow-primary/20 web:transition-all', className)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      >
        <ProgressPrimitive.Indicator className={cn('h-full w-full', className)} />
      </View>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View 
        style={indicator} 
        className={cn('h-full bg-primary rounded-full shadow-sm shadow-primary/20', className)} 
      />
    </ProgressPrimitive.Indicator>
  );
}

// Circular progress component for habit tracking
interface CircularProgressProps {
  value?: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
  indicatorClassName?: string;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

function CircularProgress({
  value = 0,
  size = 40,
  strokeWidth = 4,
  className,
  indicatorClassName,
  showValue = false,
  valuePrefix = '',
  valueSuffix = '',
}: CircularProgressProps) {
  // Calculate values
  const actualValue = value ?? 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * actualValue) / 100;

  return (
    <View className={cn('items-center justify-center', className)} style={{ width: size, height: size }}>
      <View className="absolute inset-0 items-center justify-center">
        <Animated.View
          className="h-full w-full items-center justify-center"
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
          <View className="absolute inset-0 items-center justify-center">
            <View
              className={cn('rounded-full bg-secondary/40')}
              style={{ width: size, height: size }}
            />
          </View>
          <AnimatedSvg width={size} height={size}>
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke="hsl(var(--primary))"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn('', indicatorClassName)}
            />
          </AnimatedSvg>
        </Animated.View>
      </View>
      {showValue && (
        <View className="absolute inset-0 items-center justify-center">
          <AnimatedText
            className="text-xs font-medium text-foreground"
          >
            {valuePrefix}{Math.round(actualValue)}{valueSuffix}
          </AnimatedText>
        </View>
      )}
    </View>
  );
}

export { CircularProgress };
