import { Colors, Typography } from '@/design-tokens';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type WeeklyProgressProps = {
  progress: boolean[];
  color?: string;
  size?: number;
  compact?: boolean;
};

export const WeeklyProgress = ({
  progress,
  color = Colors.primary,
  size = 12,
  compact = false,
}: WeeklyProgressProps) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={[styles.weeklyContainer, compact && styles.compact]}>
      {progress.map((completed, index) => (
        <View key={index} style={styles.dayContainer}>
          <View
            style={[
              styles.dayDot,
              {
                backgroundColor: completed ? color : Colors.gray,
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          />
          {!compact && (
            <Text style={[styles.dayLabel, { fontSize: size * 0.8 }]}>{days[index]}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weeklyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  compact: {
    gap: 4,
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayDot: {
    marginBottom: 4,
  },
  dayLabel: {
    ...Typography.styles.caption,
    color: Colors.gray,
    opacity: 0.7,
  },
}); 