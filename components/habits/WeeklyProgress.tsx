import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

export default WeeklyProgress;