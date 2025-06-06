import HabitCard from '@/components/habits/HabitCard';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Card, HabitModal, StatsOverview } from '@/components/ui';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors, Spacing } from '@/design-tokens';
import { useColorScheme } from '@/hooks/useColorScheme';
import mockHabits from '@/lib/mock/mockHabits';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar } from 'react-native';

const HABIT_COLORS = [
    Colors.progressGreen,
    Colors.progressBlue,
    Colors.progressYellow,
    Colors.primary,
    Colors.warning,
    Colors.error,
];

export default function HabitsScreen() {
    const [habits, setHabits] = useState(mockHabits);
    const [showHabitModal, setShowHabitModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<any | null>(null);
    const colorScheme = useColorScheme();

    const openAddHabit = () => {
        setEditingHabit(null);
        setShowHabitModal(true);
    };

    const openEditHabit = (habit: any) => {
        setEditingHabit(habit);
        setShowHabitModal(true);
    };

    const handleSaveHabit = (habitData: any) => {
        if (editingHabit) {
            // Düzenleme
            setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...habitData } : h));
        } else {
            // Ekleme
            setHabits(prev => [
                {
                    id: Date.now(),
                    name: habitData.name,
                    category: habitData.category,
                    color: habitData.color,
                    completedToday: false,
                    streak: 0,
                    description: habitData.description || '',
                    icon: 'star',
                    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
                    frequency: 'daily',
                },
                ...prev,
            ]);
        }
    };

    const toggleHabit = (habitId: any) => {
        setHabits(prev => prev.map(habit =>
            habit.id === habitId
                ? {
                    ...habit,
                    completedToday: !habit.completedToday,
                    streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
                }
                : habit
        ));
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning!';
        if (hour < 17) return 'Good afternoon!';
        return 'Good evening!';
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
            {/* Header */}
            <SafeAreaView style={{ backgroundColor: Colors.white }}>
                <ThemedView variant="surface" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: 8, paddingBottom: Spacing.lg, backgroundColor: Colors.white }}>
                    <ThemedView style={{ flex: 1 }}>
                        <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                            <ThemedText style={{ fontSize: 22, fontWeight: '700', color: Colors.text, marginRight: 4 }}>Good morning!</ThemedText>
                            <HelloWave size={22} style={{ marginTop: 0 }} />
                        </ThemedView>
                        <ThemedText style={{ fontSize: 15, color: Colors.gray, fontWeight: '400' }}>Ready to build some great habits?</ThemedText>
                    </ThemedView>
                    <Button
                        variant="solid"
                        leftIcon={<IconSymbol name="plus" size={18} color={Colors.white} />}
                        onPress={openAddHabit}
                        textStyle={{ color: Colors.white, fontWeight: '600', fontSize: 16 }}
                        accessibilityLabel="Add Habit"
                        title=""
                        style={{paddingVertical: 8, borderRadius: 24, backgroundColor: Colors.primary, elevation: 1, minHeight: 40}}
                    />
                </ThemedView>
            </SafeAreaView>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <StatsOverview habits={habits} />
                <ThemedView style={{ gap: Spacing.md, marginTop: Spacing.lg }}>
                    {habits.map(habit => (
                        <Pressable
                            key={habit.id}
                            onPress={() => openEditHabit(habit)}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        >
                            <HabitCard
                                habit={habit}
                                onToggle={toggleHabit}
                            />
                        </Pressable>
                    ))}
                </ThemedView>
                {/* Motivational Quote */}
                <Card variant="gradient" style={{ marginTop: Spacing.xxl, padding: 0, borderRadius: 16, overflow: 'hidden' }}>
                    <LinearGradient
                        colors={['#8B5CF6', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: Spacing.xl, alignItems: 'center' }}
                    >
                        <ThemedText type="subtitle" style={{ color: Colors.white, fontStyle: 'italic', textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 22 }}>
                            &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
                        </ThemedText>
                        <ThemedText type="caption" style={{ color: Colors.lightGray }}>
                            — Aristotle
                        </ThemedText>
                    </LinearGradient>
                </Card>
            </ScrollView>
            <HabitModal
                visible={showHabitModal}
                onClose={() => setShowHabitModal(false)}
                onSave={handleSaveHabit}
                initialHabit={editingHabit}
            />
        </ThemedView>
    );
}