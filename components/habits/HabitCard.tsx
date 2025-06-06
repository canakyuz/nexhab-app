import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { WeeklyProgress } from '@/components/ui/WeeklyProgress';
import { BORDER_RADIUS, Colors, Shadows, Spacing, Typography } from '@/design-tokens';
import React, { useState } from 'react';
import { Animated, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export type HabitCardVariant = 'detailed' | 'compact';

export type HabitCardProps = {
  habit: any;
  onToggle: (id: string) => void;
  variant?: HabitCardVariant;
  disabled?: boolean;
  style?: any;
};

export const HabitCard = ({
  habit,
  onToggle,
  variant = 'detailed',
  disabled = false,
  style,
}: HabitCardProps) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(habit.id);
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }, style]}>
      <View
        style={[
          styles.habitCard,
          variant === 'compact' && styles.compact,
          { borderLeftColor: habit.color },
          Platform.OS === 'ios' ? Shadows.card.ios : Shadows.card.android,
        ]}
        accessible
        accessibilityRole="summary"
        accessibilityLabel={habit.name}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.habitInfo}>
            <View style={styles.habitTitleRow}>
              <IconSymbol name={habit.icon} size={20} color={habit.color} style={styles.habitIcon} />
              <View style={styles.habitNameContainer}>
                <Animated.Text style={[styles.habitName, { color: habit.color }]} numberOfLines={1}>
                  {habit.name}
                </Animated.Text>
                <Badge label={habit.category} variant="ghost" style={styles.categoryBadge} textStyle={{ color: habit.color }} />
              </View>
            </View>
            {variant === 'detailed' && (
              <Animated.Text style={styles.habitDescription} numberOfLines={2}>
                {habit.description}
              </Animated.Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: habit.completedToday ? habit.color : 'transparent',
                borderColor: habit.color,
                opacity: disabled ? 0.5 : 1,
              },
            ]}
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={habit.completedToday ? 'Tamamlandı' : 'Tamamla'}
          >
            <IconSymbol
              name={habit.completedToday ? 'checkmark' : 'plus'}
              size={16}
              color={habit.completedToday ? Colors.white : habit.color}
            />
          </TouchableOpacity>
        </View>
        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.streakContainer}>
            <IconSymbol name="flame.fill" size={16} color={habit.color} />
            <Animated.Text style={styles.streakNumber}>{habit.streak}</Animated.Text>
            <Animated.Text style={styles.streakLabel}>day streak</Animated.Text>
          </View>
          <WeeklyProgress progress={habit.weeklyProgress} color={habit.color} size={12} compact={variant === 'compact'} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
  },
  habitCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: Spacing.card.padding,
    borderLeftWidth: 4,
    backgroundColor: Colors.white,
  },
  compact: {
    padding: Spacing.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
    marginRight: 12,
  },
  habitTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitIcon: {
    marginRight: 8,
  },
  habitNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitName: {
    ...Typography.styles.h5,
    flex: 1,
  },
  categoryBadge: {
    marginLeft: 8,
  },
  habitDescription: {
    ...Typography.styles.body,
    opacity: 0.7,
    lineHeight: 18,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakNumber: {
    ...Typography.styles.h6,
    marginLeft: 4,
    marginRight: 4,
  },
  streakLabel: {
    ...Typography.styles.caption,
    opacity: 0.7,
  },
});

export default HabitCard;