import * as React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Check, Calendar, Clock } from 'lucide-react-native';

// Öncelik seçenekleri
const PRIORITY_OPTIONS = [
  { name: 'Düşük', value: 'düşük', color: '#10b981' }, // emerald-500
  { name: 'Orta', value: 'orta', color: '#f59e0b' }, // amber-500
  { name: 'Yüksek', value: 'yüksek', color: '#ef4444' }, // red-500
];

// Kategori seçenekleri
const CATEGORY_OPTIONS = [
  { name: 'İş', value: 'iş' },
  { name: 'Kişisel', value: 'kişisel' },
  { name: 'Sağlık', value: 'sağlık' },
  { name: 'Alışveriş', value: 'alışveriş' },
  { name: 'Eğitim', value: 'eğitim' },
  { name: 'Sosyal', value: 'sosyal' },
  { name: 'Diğer', value: 'diğer' },
];

export default function NewTaskScreen() {
  const [taskName, setTaskName] = React.useState('');
  const [taskDate, setTaskDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = React.useState('12:00');
  const [selectedPriority, setSelectedPriority] = React.useState(PRIORITY_OPTIONS[1].value);
  const [selectedCategory, setSelectedCategory] = React.useState(CATEGORY_OPTIONS[0].value);
  const [taskNote, setTaskNote] = React.useState('');
  
  // Bugünün tarihini al
  const today = new Date().toISOString().split('T')[0];
  
  // Görev kaydet
  const saveTask = () => {
    if (!taskName.trim()) {
      Alert.alert('Hata', 'Lütfen bir görev adı girin.');
      return;
    }
    
    // Burada gerçek kaydetme işlemi yapılacak
    Alert.alert(
      'Başarılı', 
      'Görev başarıyla eklendi!',
      [{ text: 'Tamam', onPress: () => router.back() }]
    );
  };
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen 
        options={{
          title: "Yeni Görev",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-3"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={saveTask}
              className="ml-3"
            >
              <Check size={24} className="text-foreground" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView className="flex-1 p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Görev Detayları</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-2 text-foreground/70">Görev Adı</Text>
            <TextInput
              value={taskName}
              onChangeText={setTaskName}
              placeholder="Görev adını girin..."
              className="border border-border rounded-md p-3 mb-4 text-foreground bg-background"
              placeholderTextColor="#9ca3af"
            />
            
            <Text className="mb-2 text-foreground/70">Tarih</Text>
            <View className="flex-row items-center mb-4 border border-border rounded-md p-3">
              <Calendar size={18} className="text-foreground/70 mr-2" />
              <TextInput
                value={taskDate}
                onChangeText={setTaskDate}
                placeholder="YYYY-MM-DD"
                className="flex-1 text-foreground bg-background"
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <Text className="mb-2 text-foreground/70">Saat</Text>
            <View className="flex-row items-center mb-4 border border-border rounded-md p-3">
              <Clock size={18} className="text-foreground/70 mr-2" />
              <TextInput
                value={taskTime}
                onChangeText={setTaskTime}
                placeholder="HH:MM"
                className="flex-1 text-foreground bg-background"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Kategori ve Öncelik</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-2 text-foreground/70">Kategori</Text>
            <View className="flex-row flex-wrap mb-4">
              {CATEGORY_OPTIONS.map(category => (
                <TouchableOpacity
                  key={category.value}
                  onPress={() => setSelectedCategory(category.value)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${selectedCategory === category.value ? 'bg-primary/10 border border-primary' : 'bg-muted/50 border border-border'}`}
                >
                  <Text className={selectedCategory === category.value ? 'text-primary' : 'text-foreground/70'}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text className="mb-2 text-foreground/70">Öncelik</Text>
            <View className="flex-row mb-4">
              {PRIORITY_OPTIONS.map(priority => (
                <TouchableOpacity
                  key={priority.value}
                  onPress={() => setSelectedPriority(priority.value)}
                  className={`flex-1 py-2 mx-1 first:ml-0 last:mr-0 rounded-md border ${selectedPriority === priority.value ? 'border-2' : 'border'}`}
                  style={{
                    borderColor: priority.color,
                    backgroundColor: selectedPriority === priority.value ? `${priority.color}10` : 'transparent'
                  }}
                >
                  <Text 
                    className="text-center" 
                    style={{ color: priority.color }}
                  >
                    {priority.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Notlar</CardTitle>
          </CardHeader>
          <CardContent>
            <TextInput
              value={taskNote}
              onChangeText={setTaskNote}
              placeholder="Görevle ilgili notlar ekleyin..."
              multiline
              numberOfLines={4}
              className="border border-border rounded-md p-3 text-foreground bg-background min-h-[100px]"
              placeholderTextColor="#9ca3af"
              textAlignVertical="top"
            />
          </CardContent>
        </Card>
        
        <Button
          className="bg-purple-600 mb-10"
          onPress={saveTask}
        >
          <Text className="text-white">Görev Ekle</Text>
        </Button>
      </ScrollView>
    </View>
  );
} 