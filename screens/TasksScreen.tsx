import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, ScrollView, StatusBar } from 'react-native';
import { Plus, Filter, Calendar, Clock, Check, X, CalendarDays, Tag, Bell } from 'lucide-react-native';
import { useTaskStore, Task } from '../lib/store/taskStore';
import { getTodayDate, formatDate, isSameDay } from '../lib/utils';
import Animated, { FadeInDown, Layout, FadeIn, useAnimatedStyle, useSharedValue, withSpring, SlideInRight } from 'react-native-reanimated';

export default function TasksScreen() {
  const { tasks, fetchTasks, toggleTaskCompletion, deleteTask } = useTaskStore();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(getTodayDate()));
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Animation values
  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }]
    };
  });

  useEffect(() => {
    fetchTasks(formatDate(selectedDate));
  }, [selectedDate]);

  useEffect(() => {
    applyFilters();
  }, [tasks, priorityFilter]);

  const applyFilters = () => {
    let result = [...tasks];
    
    // Önceliğe göre filtrele
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(result);
  };

  const toggleFilter = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const toggleAddModal = () => {
    fabScale.value = withSpring(0.8, {}, () => {
      fabScale.value = withSpring(1);
    });
    setAddModalVisible(!addModalVisible);
  };

  const onTaskPress = (taskId: string) => {
    toggleTaskCompletion(taskId);
  };

  const onTaskDelete = (taskId: string) => {
    deleteTask(taskId);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <Animated.View
      style={styles.taskCard}
      entering={FadeInDown.duration(350)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={[styles.checkCircle, item.completed && styles.checkedCircle]}
        onPress={() => onTaskPress(item.id)}
      >
        {item.completed && <Check size={16} color="hsl(0, 0%, 100%)" />}
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[
          styles.taskName, 
          item.completed && styles.completedTaskText
        ]}>
          {item.name}
        </Text>
        
        {item.note && (
          <Text style={styles.taskNote} numberOfLines={1}>
            {item.note}
          </Text>
        )}

        <View style={styles.taskDetails}>
          {item.time && (
            <View style={styles.taskDetail}>
              <Clock size={14} color="hsl(215, 16%, 47%)" />
              <Text style={styles.detailText}>{item.time}</Text>
            </View>
          )}
          
          {item.category && (
            <View style={styles.taskDetail}>
              <Tag size={14} color="hsl(215, 16%, 47%)" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
          )}
          
          {item.priority && (
            <View style={[
              styles.priorityBadge, 
              { backgroundColor: 
                item.priority === 'high' ? 'hsl(0, 84%, 60%)' : 
                item.priority === 'medium' ? 'hsl(38, 92%, 50%)' : 
                'hsl(221, 83%, 53%)' 
              }
            ]}>
              <Text style={styles.priorityText}>
                {item.priority === 'high' ? 'Yüksek' : 
                 item.priority === 'medium' ? 'Orta' : 
                 'Düşük'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onTaskDelete(item.id)}
      >
        <X size={16} color="hsl(215, 16%, 47%)" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeIn.duration(400)}
      >
        <Text style={styles.headerTitle}>Görevlerim</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFilter}>
            <Filter size={20} color="hsl(222, 47%, 11%)" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Tarih Seçici */}
      <DateSelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      
      {/* Filtreler */}
      <Animated.View 
        style={styles.filtersContainer}
        entering={FadeInDown.delay(100).springify()}
      >
        <TouchableOpacity 
          style={[styles.filterButton, priorityFilter === 'all' && styles.activeFilterButton]} 
          onPress={() => setPriorityFilter('all')}
        >
          <Text style={[styles.filterText, priorityFilter === 'all' && styles.activeFilterText]}>Tümü</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, priorityFilter === 'high' && styles.activeFilterButton]} 
          onPress={() => setPriorityFilter('high')}
        >
          <Text style={[styles.filterText, priorityFilter === 'high' && styles.activeFilterText]}>Yüksek</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, priorityFilter === 'medium' && styles.activeFilterButton]} 
          onPress={() => setPriorityFilter('medium')}
        >
          <Text style={[styles.filterText, priorityFilter === 'medium' && styles.activeFilterText]}>Orta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, priorityFilter === 'low' && styles.activeFilterButton]} 
          onPress={() => setPriorityFilter('low')}
        >
          <Text style={[styles.filterText, priorityFilter === 'low' && styles.activeFilterText]}>Düşük</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.tasksList}
        />
      ) : (
        <EmptyTaskList onAdd={toggleAddModal} />
      )}
      
      {/* Floating Action Button */}
      <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
        <TouchableOpacity style={styles.fab} onPress={toggleAddModal}>
          <Plus size={24} color="hsl(0, 0%, 100%)" />
        </TouchableOpacity>
      </Animated.View>
      
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
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <X size={20} color="hsl(222, 47%, 11%)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Öncelik</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'all' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('all')}
                >
                  <Text style={priorityFilter === 'all' ? styles.activeFilterOptionText : styles.filterOptionText}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'high' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('high')}
                >
                  <Text style={priorityFilter === 'high' ? styles.activeFilterOptionText : styles.filterOptionText}>
                    Yüksek
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'medium' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('medium')}
                >
                  <Text style={priorityFilter === 'medium' ? styles.activeFilterOptionText : styles.filterOptionText}>
                    Orta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'low' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('low')}
                >
                  <Text style={priorityFilter === 'low' ? styles.activeFilterOptionText : styles.filterOptionText}>
                    Düşük
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

// Tarih seçici bileşeni
type DateSelectorProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  const formatDayName = (date: Date) => {
    const day = date.toLocaleDateString('tr-TR', { weekday: 'short' });
    return day.charAt(0).toUpperCase() + day.slice(1, 3);
  };

  return (
    <Animated.View 
      style={styles.dateSelector}
      entering={FadeInDown.delay(50).springify()}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateSelectorContent}
      >
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dateItem,
                isSelected && styles.selectedDateItem,
              ]}
              onPress={() => onDateChange(date)}
            >
              <Text style={[
                styles.dateDayName,
                isSelected && styles.selectedDateText,
                isToday && styles.todayText
              ]}>
                {formatDayName(date)}
              </Text>
              <Text style={[
                styles.dateNumber,
                isSelected && styles.selectedDateText,
                isToday && styles.todayText
              ]}>
                {date.getDate()}
              </Text>
              {isToday && <View style={styles.todayDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

// Boş liste gösterimi
const EmptyTaskList = ({ onAdd }: { onAdd: () => void }) => (
  <Animated.View 
    style={styles.emptyContainer}
    entering={FadeInDown.delay(150).springify()}
  >
    <View style={styles.emptyIconContainer}>
      <Bell size={40} color="hsl(215, 16%, 47%)" opacity={0.5} />
    </View>
    <Text style={styles.emptyText}>Bu gün için görev yok</Text>
    <Text style={styles.emptySubText}>
      Yeni bir görev ekleyerek başlayabilirsiniz
    </Text>
    <TouchableOpacity style={styles.emptyAddButton} onPress={onAdd}>
      <Plus size={20} color="hsl(0, 0%, 100%)" />
      <Text style={styles.emptyAddButtonText}>Görev Ekle</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(210, 40%, 98%)',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  // Tarih seçici
  dateSelector: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  dateSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    position: 'relative',
  },
  selectedDateItem: {
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  dateDayName: {
    fontSize: 13,
    color: 'hsl(215, 16%, 47%)',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  selectedDateText: {
    color: 'hsl(0, 0%, 100%)',
  },
  todayText: {
    color: 'hsl(221, 83%, 53%)',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'hsl(221, 83%, 53%)',
    position: 'absolute',
    bottom: 6,
  },
  // Filtreler
  filtersContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  activeFilterButton: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    borderColor: 'hsl(221, 83%, 53%)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)',
  },
  activeFilterText: {
    color: 'hsl(0, 0%, 100%)',
  },
  // Görevler listesi
  tasksList: {
    padding: 16,
    paddingBottom: 100, // FAB için alan
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'hsl(0, 0%, 100%)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'hsl(221, 83%, 53%)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkedCircle: {
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: 'hsl(215, 16%, 47%)',
  },
  taskNote: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    marginTop: 2,
  },
  taskDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  taskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 13,
    color: 'hsl(215, 16%, 47%)',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  priorityText: {
    color: 'hsl(0, 0%, 100%)',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'hsl(214, 32%, 97%)',
  },
  // Boş liste
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
    marginTop: 8,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: 'hsl(215, 16%, 47%)',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  emptyAddButtonText: {
    color: 'hsl(0, 0%, 100%)',
    fontWeight: '600',
    marginLeft: 8,
  },
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fab: {
    backgroundColor: 'hsl(221, 83%, 53%)',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  // Modal
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