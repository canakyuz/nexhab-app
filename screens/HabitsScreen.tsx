import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { Plus, Filter, ChevronDown, X, MoreVertical, Calendar, CheckCircle2, Clock } from 'lucide-react-native';
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
      style={[styles.habitCard, { borderLeftColor: habit.color }]}
      onPress={onPress}
      entering={FadeInDown.delay(50 * index).springify()}
    >
      <View style={styles.habitHeader}>
        <View style={styles.habitTitleContainer}>
          <Text style={styles.habitName}>{habit.name}</Text>
          <View style={styles.habitBadges}>
            <View style={styles.frequencyBadge}>
              <Calendar size={12} color="#777" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>
                {habit.frequency === 'daily' ? 'Günlük' : 
                 habit.frequency === 'weekly' ? 'Haftalık' : 'Özel'}
              </Text>
            </View>
            {habit.streak > 0 && (
              <View style={styles.streakBadge}>
                <CheckCircle2 size={12} color="#e67e22" style={{ marginRight: 4 }} />
                <Text style={styles.streakText}>{habit.streak} gün</Text>
              </View>
            )}
          </View>
        </View>
        <View style={[styles.completionIndicator, { 
          backgroundColor: habit.completedToday ? '#2ecc71' : '#f1f1f1' 
        }]} />
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
                  backgroundColor: habit.completedToday ? '#2ecc71' : '#3498db' 
                }
              ]} 
            />
          </View>
        </View>
      )}
      
      <View style={styles.habitActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Clock size={18} color="#777" />
          <Text style={styles.actionText}>Güncellenme Zamanı</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MoreVertical size={18} color="#777" />
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
              <Filter size={20} color="#333" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={addBtnStyle}>
            <TouchableOpacity style={styles.addButton} onPress={toggleAddModal}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
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
          <Text style={styles.emptyText}>Henüz alışkanlık eklenmemiş</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={toggleAddModal}>
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
          <Animated.View 
            style={styles.modalContent}
            entering={SlideInRight.springify()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrele</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Durum</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'all' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('all')}
                >
                  <Text style={activeFilter === 'all' ? styles.activeFilterText : styles.filterText}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'active' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('active')}
                >
                  <Text style={activeFilter === 'active' ? styles.activeFilterText : styles.filterText}>
                    Aktif
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, activeFilter === 'completed' && styles.activeFilterOption]} 
                  onPress={() => setActiveFilter('completed')}
                >
                  <Text style={activeFilter === 'completed' ? styles.activeFilterText : styles.filterText}>
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
                  <Text style={frequencyFilter === 'all' ? styles.activeFilterText : styles.filterText}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'daily' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('daily')}
                >
                  <Text style={frequencyFilter === 'daily' ? styles.activeFilterText : styles.filterText}>
                    Günlük
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'weekly' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('weekly')}
                >
                  <Text style={frequencyFilter === 'weekly' ? styles.activeFilterText : styles.filterText}>
                    Haftalık
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, frequencyFilter === 'custom' && styles.activeFilterOption]} 
                  onPress={() => setFrequencyFilter('custom')}
                >
                  <Text style={frequencyFilter === 'custom' ? styles.activeFilterText : styles.filterText}>
                    Özel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.applyFilterButton}
              onPress={() => {
                applyFilters();
                setFilterModalVisible(false);
              }}
            >
              <Text style={styles.applyFilterButtonText}>Uygula</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Yeni Alışkanlık Ekleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={styles.modalContent}
            entering={SlideInRight.springify()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Alışkanlık</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalNote}>
              Bu sadece bir prototip ekranıdır. Gerçek bir ekleme formu uygulamak için bu kısmı genişletebilirsiniz.
            </Text>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Kapat</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  addButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#3498db',
  },
  habitsList: {
    padding: 15,
    paddingBottom: 100, // For tab navigation
  },
  habitCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  habitTitleContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  habitBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#777',
  },
  streakText: {
    fontSize: 12,
    color: '#e67e22',
    fontWeight: '500',
  },
  completionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 10,
  },
  progressSection: {
    marginVertical: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  currentValueText: {
    fontSize: 13,
    color: '#555',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3498db',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3498db',
    borderRadius: 4,
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyAddButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilterOption: {
    backgroundColor: '#3498db',
  },
  filterText: {
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  applyFilterButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  closeModalButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
}); 