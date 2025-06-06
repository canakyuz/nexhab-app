import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, Typography } from '@/design-tokens';
import React from 'react';
import { Card } from './Card';

type StatsOverviewProps = {
  habits: any[];
};

export const StatsOverview = ({ habits }: StatsOverviewProps) => {
  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const averageStreak = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0;

  return (
    <Card style={{ borderRadius: 16, padding: 16, backgroundColor: Colors.white, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <ThemedText style={[Typography.progressTitle, { color: Colors.text, marginBottom: 12 }]}>Today&apos;s Progress</ThemedText>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white }}>
        <ThemedView style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.white }}>
          <ThemedText style={[Typography.progressValue, { color: Colors.progressGreen }]}>{completedToday}/{totalHabits}</ThemedText>
          <ThemedText style={[Typography.progressLabel, { color: Colors.gray }]}>Completed</ThemedText>
        </ThemedView>
        <ThemedView style={{ width: 1, height: 40, backgroundColor: Colors.divider }} />
        <ThemedView style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.white }}>
          <ThemedText style={[Typography.progressValue, { color: Colors.progressBlue }]}>{completionRate}%</ThemedText>
          <ThemedText style={[Typography.progressLabel, { color: Colors.gray }]}>Success Rate</ThemedText>
        </ThemedView>
        <ThemedView style={{ width: 1, height: 40, backgroundColor: Colors.divider }} />
        <ThemedView style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.white }}>
          <ThemedText style={[Typography.progressValue, { color: Colors.progressYellow }]}>{averageStreak}</ThemedText>
          <ThemedText style={[Typography.progressLabel, { color: Colors.gray }]}>Avg. Streak</ThemedText>
        </ThemedView>
      </ThemedView>
      {/* Progress Bar */}
      <ThemedView style={{
        height: 6,
        backgroundColor: Colors.divider,
        borderRadius: 3,
        marginTop: 16,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <ThemedView style={{
          height: 6,
          backgroundColor: Colors.progressGreen,
          borderRadius: 3,
          width: `${completionRate}%`,
          position: 'absolute',
          left: 0,
          top: 0,
        }} />
      </ThemedView>
    </Card>
  );
}; 