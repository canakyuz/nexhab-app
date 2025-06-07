import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { router } from 'expo-router';
import { PlusCircle, TrendingUp, CheckCircle2, Award } from 'lucide-react-native';

// Geçici veri
const HABITS = [
  { id: 1, name: 'Su İçmek', streak: 5, completedToday: false, target: 8, current: 3, unit: 'bardak' },
  { id: 2, name: 'Egzersiz', streak: 12, completedToday: false, target: 30, current: 0, unit: 'dakika' },
  { id: 3, name: 'Kitap Okumak', streak: 3, completedToday: true, target: 20, current: 20, unit: 'sayfa' },
];

const TASKS = [
  { id: 1, name: 'Proje toplantısı', completed: false, time: '14:00' },
  { id: 2, name: 'E-postaları yanıtla', completed: true, time: '10:00' },
  { id: 3, name: 'Alışveriş listesi hazırla', completed: false, time: '18:00' },
];

export default function HomeScreen() {
  const today = new Date();
  const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;
  
  const completedHabits = HABITS.filter(habit => habit.completedToday).length;
  const habitProgress = (completedHabits / HABITS.length) * 100;
  
  const completedTasks = TASKS.filter(task => task.completed).length;
  const taskProgress = (completedTasks / TASKS.length) * 100;
  
  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Başlık ve Tarih */}
      <View className="mb-4">
        <Text className="text-3xl font-bold">Merhaba!</Text>
        <Text className="text-foreground/70">{formattedDate}</Text>
      </View>
      
      {/* Günlük Özet Kartı */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Günlük Özet</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-full items-center justify-center mr-3">
              <TrendingUp size={20} color="#0284c7" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-foreground/70">Alışkanlıklar</Text>
              <Progress value={habitProgress} className="h-2 mt-1" indicatorClassName="bg-sky-600" />
            </View>
            <Text className="font-semibold ml-2">{completedHabits}/{HABITS.length}</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
              <CheckCircle2 size={20} color="#7c3aed" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-foreground/70">Görevler</Text>
              <Progress value={taskProgress} className="h-2 mt-1" indicatorClassName="bg-purple-600" />
            </View>
            <Text className="font-semibold ml-2">{completedTasks}/{TASKS.length}</Text>
          </View>
        </CardContent>
      </Card>
      
      {/* Alışkanlıklar Bölümü */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-xl font-semibold">Alışkanlıklar</Text>
        <Button
          variant="ghost"
          onPress={() => router.push("habits")}
          className="px-0"
        >
          <Text className="text-sky-600 mr-1">Tümünü Gör</Text>
        </Button>
      </View>
      
      {HABITS.slice(0, 3).map(habit => (
        <Card key={habit.id} className="mb-3">
          <CardContent className="py-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full items-center justify-center mr-3">
                <Award size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="font-semibold">{habit.name}</Text>
                  <Text className="text-foreground/70 text-sm">{habit.streak} gün</Text>
                </View>
                {habit.target ? (
                  <View className="mt-1">
                    <Progress 
                      value={(habit.current / habit.target) * 100} 
                      className="h-2" 
                      indicatorClassName="bg-emerald-600" 
                    />
                    <Text className="text-xs text-foreground/70 mt-1">
                      {habit.current}/{habit.target} {habit.unit}
                    </Text>
                  </View>
                ) : (
                  <Text className={`text-xs mt-1 ${habit.completedToday ? 'text-emerald-600' : 'text-foreground/70'}`}>
                    {habit.completedToday ? 'Tamamlandı' : 'Tamamlanmadı'}
                  </Text>
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
      
      {/* Görevler Bölümü */}
      <View className="mb-4 flex-row justify-between items-center">
        <Text className="text-xl font-semibold">Bugünkü Görevler</Text>
        <Button
          variant="ghost"
          onPress={() => router.push("tasks")}
          className="px-0"
        >
          <Text className="text-purple-600 mr-1">Tümünü Gör</Text>
        </Button>
      </View>
      
      {TASKS.map(task => (
        <Card key={task.id} className="mb-3">
          <CardContent className="py-3">
            <View className="flex-row items-center">
              <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${task.completed ? 'bg-purple-600 border-purple-600' : 'border-foreground/30'}`}>
                {task.completed && <CheckCircle2 size={16} color="#fff" />}
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className={`${task.completed ? 'line-through text-foreground/50' : 'text-foreground'}`}>
                    {task.name}
                  </Text>
                  <Text className="text-foreground/70 text-sm">{task.time}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      ))}
      
      {/* Yeni Alışkanlık Ekleme Butonu */}
      <View className="mt-2 mb-10">
        <Button
          className="bg-sky-600"
          onPress={() => router.push("habits/new")}
        >
          <PlusCircle size={18} color="#fff" className="mr-2" />
          <Text className="text-white">Yeni Alışkanlık Ekle</Text>
        </Button>
      </View>
    </ScrollView>
  );
} 