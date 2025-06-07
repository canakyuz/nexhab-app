import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useHabitStore } from '../lib/store/habitStore';
import { useTaskStore } from '../lib/store/taskStore';
import { useStatsStore } from '../lib/store/statsStore';
import { getTodayDate } from '../lib/utils';
import { TrendingUp, CheckCircle2, Plus, Calendar, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { habits, fetchHabits } = useHabitStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { stats, fetchTodayStats } = useStatsStore();

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

  return (
    <ScrollView style={styles.container}>
      {/* Başlık ve Tarih Bölümü */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Merhaba 👋</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

      {/* İstatistikler */}
      <Animated.View 
        style={styles.statsContainer}
        entering={FadeInDown.delay(100).springify()}
      >
        {stats ? (
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <TrendingUp size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.completedHabits}</Text>
                <Text style={styles.statLabel}>Alışkanlık</Text>
              </View>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.taskIcon]}>
                <Calendar size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.completedTasks}</Text>
                <Text style={styles.statLabel}>Görev</Text>
              </View>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, styles.streakIcon]}>
                <CheckCircle2 size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.statValue}>{stats.streakDays}</Text>
                <Text style={styles.statLabel}>Seri Gün</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Henüz istatistik yok</Text>
        )}
      </Animated.View>

      {/* Bugünün Alışkanlıkları */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bugünkü Alışkanlıklar</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Tümünü Gör</Text>
          <ChevronRight size={16} color="hsl(221, 83%, 53%)" />
        </TouchableOpacity>
      </View>

      {todaysHabits.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.habitsScrollContainer}
        >
          {todaysHabits.map((habit, index) => (
            <AnimatedTouchableOpacity 
              key={habit.id} 
              style={[styles.habitCard, { borderLeftColor: habit.color }]}
              entering={FadeInRight.delay(100 * index).springify()}
            >
              <Text style={styles.habitName}>{habit.name}</Text>
              {habit.target && habit.current !== undefined && (
                <View style={styles.progressContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${Math.min(100, (habit.current / habit.target) * 100)}%` }
                    ]} 
                  />
                  <Text style={styles.progressText}>
                    {habit.current}/{habit.target} {habit.unit || ''}
                  </Text>
                </View>
              )}
            </AnimatedTouchableOpacity>
          ))}
          <AnimatedTouchableOpacity 
            style={styles.addHabitCard}
            entering={FadeInRight.delay(100 * todaysHabits.length).springify()}
          >
            <Plus size={24} color="hsl(221, 83%, 53%)" />
            <Text style={styles.addHabitText}>Alışkanlık Ekle</Text>
          </AnimatedTouchableOpacity>
        </ScrollView>
      ) : (
        <Animated.View 
          style={styles.emptyHabitsContainer}
          entering={FadeInDown.delay(200).springify()}
        >
          <Text style={styles.emptyText}>Bugün için alışkanlık yok</Text>
          <TouchableOpacity style={styles.emptyAddButton}>
            <Text style={styles.emptyAddButtonText}>Alışkanlık Ekle</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Bugünün Görevleri */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bugünkü Görevler</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Tümünü Gör</Text>
          <ChevronRight size={16} color="hsl(221, 83%, 53%)" />
        </TouchableOpacity>
      </View>

      {todaysTasks.length > 0 ? (
        <View style={styles.tasksContainer}>
          {todaysTasks.slice(0, 3).map((task, index) => (
            <AnimatedTouchableOpacity 
              key={task.id} 
              style={styles.taskCard}
              entering={FadeInDown.delay(100 * index).springify()}
            >
              <View style={styles.taskContent}>
                <Text style={styles.taskName}>{task.name}</Text>
                {task.time && (
                  <Text style={styles.taskTime}>{task.time}</Text>
                )}
              </View>
              {task.priority && (
                <View style={[
                  styles.priorityBadge, 
                  { backgroundColor: 
                    task.priority === 'high' ? 'hsl(0, 84%, 60%)' : 
                    task.priority === 'medium' ? 'hsl(38, 92%, 50%)' : 
                    'hsl(221, 83%, 53%)' 
                  }
                ]}>
                  <Text style={styles.priorityText}>
                    {task.priority === 'high' ? 'Yüksek' : 
                     task.priority === 'medium' ? 'Orta' : 
                     'Düşük'}
                  </Text>
                </View>
              )}
            </AnimatedTouchableOpacity>
          ))}
          {todaysTasks.length > 3 && (
            <TouchableOpacity style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>
                {todaysTasks.length - 3} görev daha
              </Text>
              <ChevronRight size={16} color="hsl(221, 83%, 53%)" />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Animated.View 
          style={styles.emptyTasksContainer}
          entering={FadeInDown.delay(200).springify()}
        >
          <Text style={styles.emptyText}>Bugün için görev yok</Text>
          <TouchableOpacity style={styles.emptyAddButton}>
            <Text style={styles.emptyAddButtonText}>Görev Ekle</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(210, 40%, 98%)',
    padding: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: 'hsl(215, 16%, 47%)',
  },
  // İstatistikler
  statsContainer: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'hsl(221, 83%, 53%)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskIcon: {
    backgroundColor: 'hsl(38, 92%, 50%)',
  },
  streakIcon: {
    backgroundColor: 'hsl(142, 76%, 36%)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'hsl(214, 32%, 91%)',
  },
  // Bölüm başlıkları
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: 'hsl(221, 83%, 53%)',
    marginRight: 4,
  },
  // Alışkanlıklar
  habitsScrollContainer: {
    paddingBottom: 16,
  },
  habitCard: {
    width: 200,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 12,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'hsl(214, 32%, 91%)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  progressText: {
    fontSize: 12,
    color: 'hsl(215, 16%, 47%)',
    textAlign: 'right',
  },
  addHabitCard: {
    width: 200,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
    borderStyle: 'dashed',
  },
  addHabitText: {
    marginTop: 8,
    fontSize: 14,
    color: 'hsl(221, 83%, 53%)',
    fontWeight: '500',
  },
  emptyHabitsContainer: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  emptyText: {
    fontSize: 16,
    color: 'hsl(215, 16%, 47%)',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: 'hsl(0, 0%, 100%)',
    fontWeight: '500',
  },
  // Görevler
  tasksContainer: {
    marginBottom: 24,
  },
  taskCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'hsl(0, 0%, 100%)',
    fontSize: 12,
    fontWeight: '500',
  },
  showMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'hsl(214, 32%, 97%)',
    borderRadius: 12,
    marginTop: 8,
  },
  showMoreText: {
    color: 'hsl(221, 83%, 53%)',
    marginRight: 4,
    fontWeight: '500',
  },
  emptyTasksContainer: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
}); 