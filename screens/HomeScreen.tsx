import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar, ImageBackground } from 'react-native';
import { useHabitStore } from '../lib/store/habitStore';
import { useTaskStore } from '../lib/store/taskStore';
import { useStatsStore } from '../lib/store/statsStore';
import { getTodayDate, getMonthName } from '../lib/utils';
import { Bell, Calendar, Plus, User } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { HabitCard } from '../components/HabitCard';
import { ChallengeCard } from '../components/ChallengeCard';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { DateSelector, generateWeekDays } from '../components/DateSelector';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Ana ekran bileşeni
export default function HomeScreen() {
  const { habits, fetchHabits } = useHabitStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { stats, fetchTodayStats } = useStatsStore();
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [weekDays, setWeekDays] = useState(generateWeekDays());

  useEffect(() => {
    fetchHabits();
    fetchTasks(getTodayDate());
    fetchTodayStats();
  }, []);

  // Günün tamamlanmamış alışkanlıkları
  const todaysHabits = habits.filter(habit => {
    // Eğer haftalık bir alışkanlıksa bugün için geçerli mi kontrol et
    if (habit.frequency === 'weekly' && habit.weekdays) {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0: Pazar, 1: Pazartesi, ...
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      return habit.weekdays[dayNames[dayOfWeek] as keyof typeof habit.weekdays] && !habit.completedToday;
    }
    // Günlük veya özel bir alışkanlıksa ve bugün tamamlanmamışsa göster
    return (habit.frequency === 'daily' || habit.frequency === 'custom') && !habit.completedToday;
  });

  // Günün tamamlanmamış görevleri
  const todaysTasks = tasks.filter(task => !task.completed);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // İlerleme hesapla
  const totalItems = todaysHabits.length + todaysTasks.length;
  const completedItems = habits.filter(h => h.completedToday).length + tasks.filter(t => t.completed).length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleSelectDay = (day: any) => {
    setSelectedDay(day.day);
    // TODO: Seçilen güne göre alışkanlıkları ve görevleri güncelle
  };

  // Örnek meydan okuma verileri
  const challenges = [
    {
      id: '1',
      title: 'En İyi Koşucular! 🏃',
      timeLeft: '5 gün 13 saat kaldı',
      progress: 30,
      friendsJoined: [
        { id: 'user1', avatar: 'A' },
        { id: 'user2', avatar: 'B' },
      ]
    }
  ];

  // Örnek alışkanlık verileri
  const habitData = [
    {
      id: '1',
      title: 'Su iç',
      iconName: '💧',
      progress: 25,
      goal: '500/2000 ML',
      friends: [
        { id: 'user1', avatar: 'A' },
        { id: 'user2', avatar: 'B' },
        { id: 'user3', avatar: 'C' },
      ]
    },
    {
      id: '2',
      title: 'Yürüyüş',
      iconName: '🏃‍♂️',
      progress: 0,
      goal: '0/10000 ADIM',
      friends: [
        { id: 'user1', avatar: 'A' },
        { id: 'user2', avatar: 'B' },
      ]
    },
    {
      id: '3',
      title: 'Bitkileri Sula',
      iconName: '🪴',
      progress: 0,
      goal: '0/1 KEZ',
      friends: []
    },
    {
      id: '4',
      title: 'Meditasyon',
      iconName: '🧘‍♂️',
      progress: 100,
      goal: '30/30 DAKİKA',
      completed: true,
      friends: [
        { id: 'user1', avatar: 'A' },
      ]
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Üst Kısım - Selamlama */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba, Mert 👋</Text>
          <Text style={styles.subtitle}>Alışkanlıkları birlikte oluşturalım!</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Calendar size={22} color="hsl(var(--muted-foreground))" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.notificationButton]}>
            <Bell size={22} color="hsl(var(--muted-foreground))" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sekme Seçici */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={styles.activeTabText}>Bugün</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Kulüpler</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tarih Seçici */}
      <Animated.View
        style={styles.dateSelector}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <DateSelector
          days={weekDays}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
        />
      </Animated.View>

      {/* İlerleme Kartı */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
      >
        <DailyProgressCard 
          completed={completedItems}
          total={totalItems}
          percentage={progressPercentage}
        />
      </Animated.View>

      {/* Meydan Okumalar Bölümü */}
      <Animated.View
        entering={FadeInDown.delay(400).duration(500)}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meydan Okumalar</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>TÜMÜNÜ GÖR</Text>
          </TouchableOpacity>
        </View>
        
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            timeLeft={challenge.timeLeft}
            progress={challenge.progress}
            friendsJoined={challenge.friendsJoined}
          />
        ))}
      </Animated.View>

      {/* Alışkanlıklar Bölümü */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(500)}
        style={styles.habitsSection}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Alışkanlıklar</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>TÜMÜNÜ GÖR</Text>
          </TouchableOpacity>
        </View>
        
        {habitData.map(habit => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            title={habit.title}
            iconName={habit.iconName}
            progress={habit.progress}
            goal={habit.goal}
            completed={habit.completed}
            friends={habit.friends}
            onComplete={() => console.log('Completed:', habit.id)}
            onSkip={() => console.log('Skipped:', habit.id)}
            onFail={() => console.log('Failed:', habit.id)}
            onIncrement={() => console.log('Incremented:', habit.id)}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(var(--background))',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'hsl(var(--muted-foreground))',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'hsl(var(--secondary))',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'hsl(var(--destructive))',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    backgroundColor: 'hsl(var(--secondary))',
    borderRadius: 100,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: 'hsl(var(--card))',
  },
  tabText: {
    fontSize: 15,
    color: 'hsl(var(--muted-foreground))',
    fontWeight: '500',
  },
  activeTabText: {
    fontSize: 15,
    color: 'hsl(var(--primary))',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'hsl(var(--muted))',
    borderRadius: 10,
    paddingHorizontal: 6,
    marginLeft: 6,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'hsl(var(--muted-foreground))',
    fontSize: 12,
    fontWeight: '600',
  },
  dateSelector: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'hsl(var(--foreground))',
  },
  viewAllText: {
    color: 'hsl(var(--primary))',
    fontWeight: '600',
    fontSize: 14,
  },
  habitsSection: {
    paddingBottom: 120, // Ekstra alt boşluk için
  },
}); 