import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Plus, Filter, Calendar, Clock, CheckCircle, X, CalendarDays } from 'lucide-react-native';
import { useTaskStore, Task } from '../lib/store/taskStore';
import { getTodayDate, formatDate } from '../lib/utils';

export default function TasksScreen() {
  const { tasks, fetchTasks, toggleTaskCompletion } = useTaskStore();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchTasks(selectedDate);
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
    setAddModalVisible(!addModalVisible);
  };

  const handleDateChange = (offset: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={[
        styles.taskCard, 
        item.completed && styles.completedTaskCard
      ]} 
      onPress={() => toggleTaskCompletion(item.id)}
    >
      <View style={styles.taskMain}>
        <TouchableOpacity
          style={styles.checkCircle}
          onPress={() => toggleTaskCompletion(item.id)}
        >
          {item.completed ? 
            <CheckCircle size={24} color="#2ecc71" /> : 
            <View style={styles.emptyCircle} />
          }
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
        </View>
      </View>
      
      <View style={styles.taskDetails}>
        {item.time && (
          <View style={styles.taskTime}>
            <Clock size={14} color="#777" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        )}
        
        {item.priority && (
          <View style={[
            styles.priorityBadge, 
            { backgroundColor: 
              item.priority === 'high' ? '#e74c3c' : 
              item.priority === 'medium' ? '#f39c12' : 
              '#3498db' 
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Görevlerim</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
            <Filter size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={toggleAddModal}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Tarih Seçici */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => handleDateChange(-1)}>
          <Text style={styles.dateArrow}>{"<"}</Text>
        </TouchableOpacity>
        
        <View style={styles.dateContainer}>
          <CalendarDays size={18} color="#3498db" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {selectedDate === getTodayDate() 
              ? 'Bugün' 
              : formatDate(new Date(selectedDate))}
          </Text>
        </View>
        
        <TouchableOpacity onPress={() => handleDateChange(1)}>
          <Text style={styles.dateArrow}>{">"}</Text>
        </TouchableOpacity>
      </View>
      
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.tasksList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bu gün için görev yok</Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={toggleAddModal}>
            <Text style={styles.emptyAddButtonText}>Görev Ekle</Text>
          </TouchableOpacity>
        </View>
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
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Öncelik</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'all' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('all')}
                >
                  <Text style={priorityFilter === 'all' ? styles.activeFilterText : styles.filterText}>
                    Tümü
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'high' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('high')}
                >
                  <Text style={priorityFilter === 'high' ? styles.activeFilterText : styles.filterText}>
                    Yüksek
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'medium' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('medium')}
                >
                  <Text style={priorityFilter === 'medium' ? styles.activeFilterText : styles.filterText}>
                    Orta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.filterOption, priorityFilter === 'low' && styles.activeFilterOption]} 
                  onPress={() => setPriorityFilter('low')}
                >
                  <Text style={priorityFilter === 'low' ? styles.activeFilterText : styles.filterText}>
                    Düşük
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
          </View>
        </View>
      </Modal>
      
      {/* Yeni Görev Ekleme Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Görev</Text>
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateArrow: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tasksList: {
    padding: 15,
    gap: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  completedTaskCard: {
    opacity: 0.7,
  },
  taskMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkCircle: {
    marginRight: 10,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  taskNote: {
    fontSize: 14,
    color: '#777',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#777',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
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
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyFilterButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
}); 