import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, TextInput, Dimensions, StatusBar, ScrollView } from 'react-native';
import { Plus, Filter, ChevronDown, X, MoreVertical, Calendar, CheckCircle2, Clock, Target, TrendingUp, Award } from 'lucide-react-native';
import { useHabitStore, Habit } from '../lib/store/habitStore';
import Animated, { FadeInDown, SlideInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface HabitItemProps {
  habit: Habit;
  onPress: () => void;
  index: number;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onPress, index }) => {
  // Progress calculation
  const progress = habit.target && habit.current !== undefined 
    ? Math.min(100, (habit.current / habit.target) * 100) 
    : 0;
  
  return (
    <AnimatedTouchableOpacity 
      style={styles.habitCard}
      onPress={onPress}
      entering={FadeInDown.delay(50 * index).springify()}
    >
      <View style={[styles.habitColorBadge, { backgroundColor: habit.color }]} />
      
      <View style={styles.habitHeader}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <View style={[styles.completionIndicator, { 
          backgroundColor: habit.completedToday ? 'hsl(142, 76%, 36%)' : 'hsl(214, 32%, 91%)' 
        }]} />
      </View>

      <View style={styles.habitBadges}>
        <View style={styles.frequencyBadge}>
          <Calendar size={12} color="hsl(215, 16%, 47%)" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>
            {habit.frequency === 'daily' ? 'Günlük' : 
             habit.frequency === 'weekly' ? 'Haftalık' : 'Özel'}
          </Text>
        </View>
        {habit.streak > 0 && (
          <View style={styles.streakBadge}>
            <Award size={12} color="hsl(38, 92%, 50%)" style={{ marginRight: 4 }} />
            <Text style={styles.streakText}>{habit.streak} gün</Text>
          </View>
        )}
      </View>
      
      {habit.target && habit.current !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.currentValueText}>
              {habit.current}/{habit.target} {habit.unit || ''}
            </Text>
            <Text style={styles.percentText}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${progress}%`,
                  backgroundColor: habit.completedToday ? 'hsl(142, 76%, 36%)' : 'hsl(221, 83%, 53%)' 
                }
              ]} 
            />
          </View>
        </View>
      )}
      
      <View style={styles.habitActions}>
        <View style={styles.habitInfoContainer}>
          <Clock size={14} color="hsl(215, 16%, 47%)" />
          <Text style={styles.habitInfoText}>
            {habit.completedToday ? 'Bugün tamamlandı' : 'Bekliyor'}
          </Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <MoreVertical size={16} color="hsl(215, 16%, 47%)" />
        </TouchableOpacity>
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default function HabitsScreen() {
  const { habits, fetchHabits, toggleHabitCompletion } = useHabitStore();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | 'daily' | 'weekly' | 'custom'>('all');
  
  // Animation values
  const headerHeight = useSharedValue(60);
  const filterBtnScale = useSharedValue(1);
  const addBtnScale = useSharedValue(1);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [habits, activeFilter, frequencyFilter]);

  const applyFilters = () => {
    let result = [...habits];
    
    // Tamamlanma durumuna göre filtrele
    if (activeFilter === 'active') {
      result = result.filter(habit => !habit.completedToday);
    } else if (activeFilter === 'completed') {
      result = result.filter(habit => habit.completedToday);
    }
    
    // Sıklığa göre filtrele
    if (frequencyFilter !== 'all') {
      result = result.filter(habit => habit.frequency === frequencyFilter);
    }
    
    setFilteredHabits(result);
  };

  const toggleFilter = () => {
    filterBtnScale.value = withSpring(0.9, {}, () => {
      filterBtnScale.value = withSpring(1);
    });
    setFilterModalVisible(!filterModalVisible);
  };

  const toggleAddModal = () => {
    addBtnScale.value = withSpring(0.9, {}, () => {
      addBtnScale.value = withSpring(1);
    });
    setAddModalVisible(!addModalVisible);
  };

  // Animated styles
  const filterBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: filterBtnScale.value }],
    };
  });

  const addBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: addBtnScale.value }],
    };
  });

  // Özet istatistikleri
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const inProgressHabits = habits.filter(h => h.current !== undefined && h.current > 0 && !h.completedToday).length;
  const streakHabits = habits.filter(h => h.streak > 0).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Alışkanlıklarım</Text>
          <Text style={styles.headerSubtitle}>
            {filteredHabits.length} alışkanlık {
              activeFilter === 'active' ? '(aktif)' : 
              activeFilter === 'completed' ? '(tamamlanmış)' : ''
            }
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Animated.View style={filterBtnStyle}>
            <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
              <Filter size={20} color="hsl(222, 47%, 11%)" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={addBtnStyle}>
            <TouchableOpacity style={styles.addButton} onPress={toggleAddModal}>
              <Plus size={20} color="hsl(0, 0%, 100%)" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Özet Kartları */}
      <Animated.View 
        style={styles.statsGrid}
        entering={FadeInDown.delay(100).springify()}
      >
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'hsl(221, 83%, 53%)' }]}>
            <Target size={18} color="hsl(0, 0%, 100%)" />
          </View>
          <Text style={styles.statValue}>{totalHabits}</Text>
          <Text style={styles.statLabel}>Toplam</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'hsl(142, 76%, 36%)' }]}>
            <CheckCircle2 size={18} color="hsl(0, 0%, 100%)" />
          </View>
          <Text style={styles.statValue}>{completedHabits}</Text>
          <Text style={styles.statLabel}>Tamamlandı</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'hsl(38, 92%, 50%)' }]}>
            <TrendingUp size={18} color="hsl(0, 0%, 100%)" />
          </View>
          <Text style={styles.statValue}>{inProgressHabits}</Text>
          <Text style={styles.statLabel}>Devam Ediyor</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'hsl(280, 67%, 45%)' }]}>
            <Award size={18} color="hsl(0, 0%, 100%)" />
          </View>
          <Text style={styles.statValue}>{streakHabits}</Text>
          <Text style={styles.statLabel}>Seriler</Text>
        </View>
      </Animated.View>
      
      {/* Filtre Çubukları */}
      <Animated.View 
        style={styles.filterTabs}
        entering={FadeInDown.delay(150).springify()}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]} 
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'all' && styles.activeFilterTabText]}>
              Tümü
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'active' && styles.activeFilterTab]} 
            onPress={() => setActiveFilter('active')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'active' && styles.activeFilterTabText]}>
              Aktif
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'completed' && styles.activeFilterTab]} 
            onPress={() => setActiveFilter('completed')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'completed' && styles.activeFilterTabText]}>
              Tamamlanan
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      
      {filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          renderItem={({ item, index }) => (
            <HabitItem
              habit={item}
              onPress={() => toggleHabitCompletion(item.id)}
              index={index}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.habitsList}
        />
      ) : (
        <Animated.View 
          style={styles.emptyContainer}
          entering={FadeInDown.delay(100).springify()}
        >
          <View style={styles.emptyIconContainer}>
            <Target size={40} color="hsl(215, 16%, 47%)" opacity={0.5} />
          </View>
          <Text style={styles.emptyText}>Henüz alışkanlık eklenmemiş</Text>
          <Text style={styles.emptySubText}>
            Yeni alışkanlıklar ekleyerek hedeflerinize ulaşın
          </Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={toggleAddModal}>
            <Plus size={20} color="hsl(0, 0%, 100%)" />
            <Text style={styles.emptyAddButtonText}>Alışkanlık Ekle</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Filtre Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrele</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <X size={20} color="hsl(222, 47%, 11%)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Durum</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'all' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('all')}
                >
                  <Text style={[styles.filterOptionText, activeFilter === 'all' && styles.activeFilterOptionText]}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'active' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('active')}
                >
                  <Text style={[styles.filterOptionText, activeFilter === 'active' && styles.activeFilterOptionText]}>
                    Aktif
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'completed' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('completed')}
                >
                  <Text style={[styles.filterOptionText, activeFilter === 'completed' && styles.activeFilterOptionText]}>
                    Tamamlanmış
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sıklık</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'all' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('all')}
                >
                  <Text style={[styles.filterOptionText, frequencyFilter === 'all' && styles.activeFilterOptionText]}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'daily' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('daily')}
                >
                  <Text style={[styles.filterOptionText, frequencyFilter === 'daily' && styles.activeFilterOptionText]}>
                    Günlük
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'weekly' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('weekly')}
                >
                  <Text style={[styles.filterOptionText, frequencyFilter === 'weekly' && styles.activeFilterOptionText]}>
                    Haftalık
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'custom' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('custom')}
                >
                  <Text style={[styles.filterOptionText, frequencyFilter === 'custom' && styles.activeFilterOptionText]}>
                    Özel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(210, 40%, 98%)',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: 'hsl(210, 40%, 98%)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'hsl(214, 32%, 91%)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'hsl(221, 83%, 53%)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'hsl(221, 83%, 53%)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 4,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: 'hsl(222, 47%, 11%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
  },
  statLabel: {
    fontSize: 12,
    color: 'hsl(215, 16%, 47%)',
    marginTop: 2,
  },
  filterTabs: {
    marginBottom: 12,
  },
  filterTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'hsl(214, 32%, 91%)',
  },
  activeFilterTab: {
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  filterTabText: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: 'hsl(0, 0%, 100%)',
  },
  habitsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  habitCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'hsl(222, 47%, 11%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 0,
  },
  habitColorBadge: {
    width: 5,
    height: 40,
    borderRadius: 2.5,
    position: 'absolute',
    left: 6,
    top: 16,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  completionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  habitBadges: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 10,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'hsl(214, 32%, 91%)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'hsl(38, 92%, 95%)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: 'hsl(215, 16%, 47%)',
  },
  streakText: {
    fontSize: 12,
    color: 'hsl(38, 92%, 50%)',
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  currentValueText: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'hsl(214, 32%, 91%)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'hsl(221, 83%, 53%)',
    borderRadius: 3,
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
  },
  habitInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitInfoText: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginLeft: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'hsl(214, 32%, 91%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 24,
    margin: 16,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'hsl(214, 32%, 97%)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyAddButtonText: {
    color: 'hsl(0, 0%, 100%)',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  modalCloseButton: {
    padding: 8,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: 'hsl(214, 32%, 97%)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilterOption: {
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  filterOptionText: {
    color: 'hsl(222, 47%, 11%)',
    fontWeight: '500',
  },
  activeFilterOptionText: {
    color: 'hsl(0, 0%, 100%)',
  },
  applyButton: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: 'hsl(0, 0%, 100%)',
    fontSize: 16,
    fontWeight: '600',
  },
}); 