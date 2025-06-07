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
          <ChevronRight size={16} color="#3498db" />
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
            <Plus size={24} color="#3498db" />
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
          <ChevronRight size={16} color="#3498db" />
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
                    task.priority === 'high' ? '#e74c3c' : 
                    task.priority === 'medium' ? '#f39c12' : 
                    '#3498db' 
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
            <TouchableOpacity style={styles.moreTasksButton}>
              <Text style={styles.moreTasksText}>+{todaysTasks.length - 3} Daha Fazla</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Animated.View 
          style={styles.emptyTasksContainer}
          entering={FadeInDown.delay(300).springify()}
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#777',
  },
  statsContainer: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  taskIcon: {
    backgroundColor: '#2ecc71',
  },
  streakIcon: {
    backgroundColor: '#e67e22',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#3498db',
    fontSize: 14,
    marginRight: 2,
  },
  habitsScrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: width * 0.65,
    marginRight: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 15,
    fontSize: 12,
    color: '#777',
  },
  addHabitCard: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 15,
    borderRadius: 12,
    width: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  addHabitText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  emptyHabitsContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tasksContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100, // For tab navigation
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: '#777',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  moreTasksButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 12,
    marginTop: 5,
  },
  moreTasksText: {
    color: '#3498db',
    fontWeight: '500',
  },
  emptyTasksContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  emptyAddButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 