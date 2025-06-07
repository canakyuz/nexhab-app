import * as React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { router } from 'expo-router';
import { 
  PlusCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Tag,
  ChevronRight,
  MoreVertical,
  CalendarDays
} from 'lucide-react-native';

// Geçici veri
const TASKS = [
  { 
    id: 1, 
    name: 'Proje toplantısı', 
    completed: false, 
    time: '14:00',
    date: '2023-10-20',
    priority: 'yüksek',
    category: 'İş'
  },
  { 
    id: 2, 
    name: 'E-postaları yanıtla', 
    completed: true, 
    time: '10:00',
    date: '2023-10-20',
    priority: 'orta',
    category: 'İş'
  },
  { 
    id: 3, 
    name: 'Alışveriş listesi hazırla', 
    completed: false, 
    time: '18:00',
    date: '2023-10-20',
    priority: 'düşük',
    category: 'Kişisel'
  },
  { 
    id: 4, 
    name: 'Spor salonu üyeliği yenile', 
    completed: false, 
    time: '17:30',
    date: '2023-10-21',
    priority: 'orta',
    category: 'Sağlık'
  },
  { 
    id: 5, 
    name: 'Kitap kulübü toplantısı', 
    completed: false, 
    time: '19:00',
    date: '2023-10-22',
    priority: 'orta',
    category: 'Sosyal'
  }
];

// Bugünün tarihini al
const TODAY = new Date().toISOString().split('T')[0];

// Tarih formatını düzenle
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (dateString === today.toISOString().split('T')[0]) {
    return 'Bugün';
  } else if (dateString === tomorrow.toISOString().split('T')[0]) {
    return 'Yarın';
  } else {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}`;
  }
}

// Öncelik rengini belirle
function getPriorityColor(priority) {
  switch(priority) {
    case 'yüksek': return '#ef4444'; // red-500
    case 'orta': return '#f59e0b'; // amber-500
    case 'düşük': return '#10b981'; // emerald-500
    default: return '#6b7280'; // gray-500
  }
}

export default function TasksScreen() {
  const [selectedTab, setSelectedTab] = React.useState('today');
  
  const filteredTasks = React.useMemo(() => {
    if (selectedTab === 'today') return TASKS.filter(task => task.date === TODAY);
    if (selectedTab === 'upcoming') return TASKS.filter(task => task.date > TODAY);
    if (selectedTab === 'completed') return TASKS.filter(task => task.completed);
    return TASKS;
  }, [selectedTab]);
  
  // Tarihe göre grupla
  const groupedTasks = React.useMemo(() => {
    const groups = {};
    
    filteredTasks.forEach(task => {
      if (!groups[task.date]) {
        groups[task.date] = [];
      }
      groups[task.date].push(task);
    });
    
    // Tarihleri sırala
    return Object.keys(groups)
      .sort()
      .map(date => ({
        date,
        formattedDate: formatDate(date),
        tasks: groups[date]
      }));
  }, [filteredTasks]);
  
  const completedTasks = TASKS.filter(task => task.completed).length;
  const taskProgress = (completedTasks / TASKS.length) * 100;
  
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {/* Özet Kartı */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Görev Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
                <CheckCircle2 size={20} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Progress value={taskProgress} className="h-2" indicatorClassName="bg-purple-600" />
              </View>
              <Text className="font-semibold ml-2">{completedTasks}/{TASKS.length}</Text>
            </View>
            
            <Text className="text-foreground/70 text-sm">
              Toplam {TASKS.length} görevinizden {completedTasks} tanesini tamamladınız.
            </Text>
          </CardContent>
        </Card>
        
        {/* Filtre Seçenekleri */}
        <View className="flex-row mb-6">
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'today' ? 'border-purple-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('today')}
          >
            <Text className={selectedTab === 'today' ? 'text-purple-600 font-semibold' : 'text-foreground/70'}>Bugün</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'upcoming' ? 'border-purple-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text className={selectedTab === 'upcoming' ? 'text-purple-600 font-semibold' : 'text-foreground/70'}>Yaklaşan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'completed' ? 'border-purple-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('completed')}
          >
            <Text className={selectedTab === 'completed' ? 'text-purple-600 font-semibold' : 'text-foreground/70'}>Tamamlanan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'all' ? 'border-purple-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('all')}
          >
            <Text className={selectedTab === 'all' ? 'text-purple-600 font-semibold' : 'text-foreground/70'}>Tümü</Text>
          </TouchableOpacity>
        </View>
        
        {/* Görev Listesi */}
        {groupedTasks.map(group => (
          <View key={group.date} className="mb-6">
            <View className="flex-row items-center mb-2">
              <CalendarDays size={16} className="text-foreground/70 mr-2" />
              <Text className="text-foreground/70 font-medium">{group.formattedDate}</Text>
            </View>
            
            {group.tasks.map(task => (
              <Card key={task.id} className="mb-3">
                <CardContent className="py-4">
                  <View className="flex-row items-center">
                    <TouchableOpacity 
                      className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${task.completed ? 'bg-purple-600 border-purple-600' : 'border-foreground/30'}`}
                      onPress={() => {
                        // Burada tamamlama durumunu değiştirme işlemi yapılacak
                      }}
                    >
                      {task.completed && <CheckCircle2 size={16} color="#fff" />}
                    </TouchableOpacity>
                    
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center">
                        <Text className={`text-base ${task.completed ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                          {task.name}
                        </Text>
                        <TouchableOpacity>
                          <MoreVertical size={20} className="text-foreground/70" />
                        </TouchableOpacity>
                      </View>
                      
                      <View className="flex-row items-center mt-1">
                        <View className="flex-row items-center mr-3">
                          <Clock size={12} className="text-foreground/70 mr-1" />
                          <Text className="text-xs text-foreground/70">{task.time}</Text>
                        </View>
                        
                        <View className="flex-row items-center mr-3">
                          <Tag size={12} className="text-foreground/70 mr-1" />
                          <Text className="text-xs text-foreground/70">{task.category}</Text>
                        </View>
                        
                        <View 
                          style={{backgroundColor: `${getPriorityColor(task.priority)}20`}}
                          className="px-2 py-0.5 rounded-full"
                        >
                          <Text 
                            style={{color: getPriorityColor(task.priority)}}
                            className="text-xs font-medium"
                          >
                            {task.priority}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ))}
        
        {/* Boş Durum */}
        {filteredTasks.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-foreground/70 text-center mb-4">
              Bu kategoride henüz görev bulunmuyor.
            </Text>
            <Button
              variant="outline"
              className="border-dashed"
              onPress={() => router.push("tasks/new")}
            >
              <PlusCircle size={16} className="text-foreground mr-2" />
              <Text>Yeni Görev Ekle</Text>
            </Button>
          </View>
        )}
      </ScrollView>
      
      {/* Yeni Görev Ekleme Butonu */}
      <View className="absolute bottom-8 right-8">
        <Button
          className="w-14 h-14 rounded-full bg-purple-600"
          onPress={() => router.push("tasks/new")}
        >
          <PlusCircle size={24} color="#fff" />
        </Button>
      </View>
    </View>
  );
} 