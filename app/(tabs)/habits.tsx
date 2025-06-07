import * as React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { router } from 'expo-router';
import { 
  PlusCircle, 
  Award, 
  Check, 
  ChevronRight, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp
} from 'lucide-react-native';

// Geçici veri
const HABITS = [
  { 
    id: 1, 
    name: 'Su İçmek', 
    streak: 5, 
    completedToday: false, 
    target: 8, 
    current: 3, 
    unit: 'bardak',
    frequency: 'Günlük',
    color: '#0284c7' // sky-600
  },
  { 
    id: 2, 
    name: 'Egzersiz', 
    streak: 12, 
    completedToday: false, 
    target: 30, 
    current: 0, 
    unit: 'dakika',
    frequency: 'Haftada 3 kez',
    color: '#7c3aed' // purple-600
  },
  { 
    id: 3, 
    name: 'Kitap Okumak', 
    streak: 3, 
    completedToday: true, 
    target: 20, 
    current: 20, 
    unit: 'sayfa',
    frequency: 'Günlük',
    color: '#059669' // emerald-600
  },
  { 
    id: 4, 
    name: 'Meditasyon', 
    streak: 7, 
    completedToday: false, 
    target: 10, 
    current: 0, 
    unit: 'dakika',
    frequency: 'Günlük',
    color: '#ea580c' // orange-600
  },
  { 
    id: 5, 
    name: 'Yürüyüş', 
    streak: 15, 
    completedToday: true, 
    target: 5000, 
    current: 6200, 
    unit: 'adım',
    frequency: 'Günlük',
    color: '#0d9488' // teal-600
  }
];

export default function HabitsScreen() {
  const [selectedTab, setSelectedTab] = React.useState('all');
  
  const filteredHabits = React.useMemo(() => {
    if (selectedTab === 'all') return HABITS;
    if (selectedTab === 'completed') return HABITS.filter(habit => habit.completedToday);
    if (selectedTab === 'incomplete') return HABITS.filter(habit => !habit.completedToday);
    return HABITS;
  }, [selectedTab]);
  
  const completedHabits = HABITS.filter(habit => habit.completedToday).length;
  const habitProgress = (completedHabits / HABITS.length) * 100;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {/* Özet Kartı */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Alışkanlık Performansınız</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-full items-center justify-center mr-3">
                <TrendingUp size={20} color="#0284c7" />
              </View>
              <View className="flex-1">
                <Progress value={habitProgress} className="h-2" indicatorClassName="bg-sky-600" />
              </View>
              <Text className="font-semibold ml-2">{completedHabits}/{HABITS.length}</Text>
            </View>
            
            <Text className="text-foreground/70 text-sm">
              Bugün {HABITS.length} alışkanlığınızdan {completedHabits} tanesini tamamladınız.
            </Text>
          </CardContent>
        </Card>
        
        {/* Filtre Seçenekleri */}
        <View className="flex-row mb-6">
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'all' ? 'border-sky-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('all')}
          >
            <Text className={selectedTab === 'all' ? 'text-sky-600 font-semibold' : 'text-foreground/70'}>Tümü</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'completed' ? 'border-sky-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('completed')}
          >
            <Text className={selectedTab === 'completed' ? 'text-sky-600 font-semibold' : 'text-foreground/70'}>Tamamlanan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2 border-b-2 items-center ${selectedTab === 'incomplete' ? 'border-sky-600' : 'border-transparent'}`}
            onPress={() => setSelectedTab('incomplete')}
          >
            <Text className={selectedTab === 'incomplete' ? 'text-sky-600 font-semibold' : 'text-foreground/70'}>Tamamlanmayan</Text>
          </TouchableOpacity>
        </View>
        
        {/* Alışkanlık Listesi */}
        {filteredHabits.map(habit => (
          <Card key={habit.id} className="mb-3">
            <CardContent className="py-4">
              <View className="flex-row items-center">
                <View 
                  style={{backgroundColor: `${habit.color}20`}} // %20 opaklık
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                >
                  <Award size={24} color={habit.color} />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="font-semibold text-base">{habit.name}</Text>
                    <TouchableOpacity>
                      <MoreVertical size={20} className="text-foreground/70" />
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="text-foreground/70 text-xs mb-1">{habit.frequency} • {habit.streak} gün</Text>
                  
                  {habit.target ? (
                    <View className="mt-1">
                      <Progress 
                        value={(habit.current / habit.target) * 100} 
                        className="h-2" 
                        indicatorClassName={`bg-[${habit.color}]`} 
                      />
                      <View className="flex-row justify-between mt-1">
                        <Text className="text-xs text-foreground/70">
                          {habit.current}/{habit.target} {habit.unit}
                        </Text>
                        <TouchableOpacity 
                          className="bg-sky-100 dark:bg-sky-900 rounded-full w-6 h-6 items-center justify-center"
                          onPress={() => {
                            // Burada ilerlemeyi artırma işlemi yapılacak
                          }}
                        >
                          <PlusCircle size={14} color="#0284c7" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View className="flex-row justify-between mt-1">
                      <Text className={`text-xs ${habit.completedToday ? 'text-emerald-600' : 'text-foreground/70'}`}>
                        {habit.completedToday ? 'Tamamlandı' : 'Tamamlanmadı'}
                      </Text>
                      <TouchableOpacity 
                        className={`rounded-full w-6 h-6 items-center justify-center ${habit.completedToday ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-800'}`}
                        onPress={() => {
                          // Burada tamamlama durumunu değiştirme işlemi yapılacak
                        }}
                      >
                        {habit.completedToday ? (
                          <Check size={14} color="#059669" />
                        ) : (
                          <Check size={14} className="text-foreground/30" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
        
        {/* Boş Durum */}
        {filteredHabits.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-foreground/70 text-center mb-4">
              Bu kategoride henüz alışkanlık bulunmuyor.
            </Text>
            <Button
              variant="outline"
              className="border-dashed"
              onPress={() => router.push("habits/new")}
            >
              <PlusCircle size={16} className="text-foreground mr-2" />
              <Text>Yeni Alışkanlık Ekle</Text>
            </Button>
          </View>
        )}
      </ScrollView>
      
      {/* Yeni Alışkanlık Ekleme Butonu */}
      <View className="absolute bottom-8 right-8">
        <Button
          className="w-14 h-14 rounded-full bg-sky-600"
          onPress={() => router.push("habits/new")}
        >
          <PlusCircle size={24} color="#fff" />
        </Button>
      </View>
    </View>
  );
} 