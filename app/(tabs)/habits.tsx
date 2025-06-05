import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import mockHabits from '@/lib/mock/mockHabits'; // Assuming you have a mock data file

const { width } = Dimensions.get('window');

// Mock data with better structure

const WeeklyProgress = ({ progress, color, size = 8 } :{progress: any, color: any, size: any}) => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <View style={styles.weeklyContainer}>
            {progress.map((completed: string, index: any) => (
                <View key={index} style={styles.dayContainer}>
                    <View
                        style={[
                            styles.dayDot,
                            {
                                backgroundColor: completed ? color : '#374151',
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                            },
                        ]}
                    />
                    <Text style={[styles.dayLabel, { fontSize: size * 0.8 }]}>
                        {days[index]}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const HabitCard = ({ habit, onToggle }: {habit:any, onToggle:any}) => {
    const [scaleAnim] = useState(new Animated.Value(1));
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = () => {
        // Haptic feedback and animation
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
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
            <ThemedView style={[styles.habitCard, { borderLeftColor: habit.color }]}>
                {/* Header */}
                <View style={styles.cardHeader}>
                    <View style={styles.habitInfo}>
                        <View style={styles.habitTitleRow}>
                            <IconSymbol
                                name={habit.icon}
                                size={20}
                                color={habit.color}
                                style={styles.habitIcon}
                            />
                            <ThemedText type="defaultSemiBold" style={styles.habitName}>
                                {habit.name}
                            </ThemedText>
                            <View style={[styles.categoryBadge, { backgroundColor: `${habit.color}20` }]}>
                                <Text style={[styles.categoryText, { color: habit.color }]}>
                                    {habit.category}
                                </Text>
                            </View>
                        </View>
                        <ThemedText style={styles.habitDescription}>
                            {habit.description}
                        </ThemedText>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.checkButton,
                            {
                                backgroundColor: habit.completedToday ? habit.color : 'transparent',
                                borderColor: habit.color,
                            },
                        ]}
                        onPress={handlePress}
                        activeOpacity={0.8}
                    >
                        <IconSymbol
                            name={habit.completedToday ? "checkmark" : "plus"}
                            size={16}
                            color={habit.completedToday ? '#FFFFFF' : habit.color}
                        />
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                    <View style={styles.streakContainer}>
                        <IconSymbol name="flame.fill" size={16} color={habit.color} />
                        <ThemedText style={styles.streakNumber}>{habit.streak}</ThemedText>
                        <ThemedText style={styles.streakLabel}>day streak</ThemedText>
                    </View>

                    <WeeklyProgress progress={habit.weeklyProgress} color={habit.color} size={12} />
                </View>
            </ThemedView>
        </Animated.View>
    );
};

const StatsOverview = ({ habits }: {habits: any}) => {
    const completedToday = habits.filter((h: { completedToday: any; }) => h.completedToday).length;
    const totalHabits = habits.length;
    const completionRate = Math.round((completedToday / totalHabits) * 100);
    const averageStreak = Math.round(habits.reduce((sum: any, h: any) => sum + h.streak, 0) / habits.length);

    const colorScheme = useColorScheme();

    return (
        <ThemedView style={styles.statsCard}>
            <ThemedText type="subtitle" style={styles.statsTitle}>
                Today&apos;s Progress
            </ThemedText>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#10B981' }]}>
                        {completedToday}/{totalHabits}
                    </Text>
                    <ThemedText style={styles.statLabel}>Completed</ThemedText>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#8B5CF6' }]}>
                        {completionRate}%
                    </Text>
                    <ThemedText style={styles.statLabel}>Success Rate</ThemedText>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                        {averageStreak}
                    </Text>
                    <ThemedText style={styles.statLabel}>Avg. Streak</ThemedText>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFill,
                            { width: `${completionRate}%` }
                        ]}
                    />
                </View>
            </View>
        </ThemedView>
    );
};

export default function HabitsScreen() {
    const [habits, setHabits] = useState(mockHabits);
    const colorScheme = useColorScheme();

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
        <ThemedView style={styles.container}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <ThemedView style={styles.header}>
                <View>
                    <ThemedText type="title" style={styles.greeting}>
                        {getGreeting()} 👋
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>
                        Ready to build some great habits?
                    </ThemedText>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <IconSymbol name="person.crop.circle.fill" size={32} color={Colors[colorScheme ?? 'light'].tint} />
                </TouchableOpacity>
            </ThemedView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <StatsOverview habits={habits} />

                <View style={styles.habitsHeader}>
                    <ThemedText type="subtitle">Your Habits</ThemedText>
                    <TouchableOpacity style={styles.addButton}>
                        <IconSymbol name="plus.circle.fill" size={20} color="#10B981" />
                        <Text style={styles.addButtonText}>Add Habit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.habitsList}>
                    {habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onToggle={toggleHabit}
                        />
                    ))}
                </View>

                {/* Motivational Quote */}
                <View style={styles.quoteContainer}>
                    <LinearGradient
                        colors={['#8B5CF6', '#EC4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quoteGradient}
                    >
                        <ThemedText style={styles.quoteText}>
                            &quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;
                        </ThemedText>
                        <ThemedText style={styles.quoteAuthor}>
                            — Aristotle
                        </ThemedText>
                    </LinearGradient>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    greeting: {
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.7,
    },
    profileButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    statsCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statsTitle: {
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#374151',
        marginHorizontal: 16,
    },
    progressBarContainer: {
        marginTop: 8,
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#374151',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#10B981',
        borderRadius: 3,
    },
    habitsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B98120',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addButtonText: {
        color: '#10B981',
        fontWeight: '600',
        marginLeft: 4,
        fontSize: 14,
    },
    habitsList: {
        gap: 12,
    },
    cardContainer: {
        marginBottom: 4,
    },
    habitCard: {
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
    habitName: {
        flex: 1,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '600',
    },
    habitDescription: {
        fontSize: 14,
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
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 4,
    },
    streakLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    weeklyContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    dayContainer: {
        alignItems: 'center',
    },
    dayDot: {
        marginBottom: 4,
    },
    dayLabel: {
        fontSize: 10,
        opacity: 0.6,
    },
    quoteContainer: {
        marginTop: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    quoteGradient: {
        padding: 20,
        alignItems: 'center',
    },
    quoteText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 22,
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#E5E7EB',
    },
});