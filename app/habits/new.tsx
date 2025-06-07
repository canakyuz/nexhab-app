import * as React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Check, X } from 'lucide-react-native';

// Alışkanlık renk seçenekleri
const COLOR_OPTIONS = [
  { name: 'Mavi', value: '#0284c7' }, // sky-600
  { name: 'Mor', value: '#7c3aed' }, // purple-600
  { name: 'Yeşil', value: '#059669' }, // emerald-600
  { name: 'Turuncu', value: '#ea580c' }, // orange-600
  { name: 'Kırmızı', value: '#dc2626' }, // red-600
  { name: 'Pembe', value: '#db2777' }, // pink-600
];

// Frekans seçenekleri
const FREQUENCY_OPTIONS = [
  { name: 'Günlük', value: 'daily' },
  { name: 'Haftalık', value: 'weekly' },
  { name: 'Özel', value: 'custom' },
];

// Hedef tipi seçenekleri
const TARGET_TYPES = [
  { name: 'Tamamlama', value: 'completion' },
  { name: 'Sayı/Miktar', value: 'quantity' },
];

export default function NewHabitScreen() {
  const [habitName, setHabitName] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState(COLOR_OPTIONS[0].value);
  const [selectedFrequency, setSelectedFrequency] = React.useState(FREQUENCY_OPTIONS[0].value);
  const [selectedTargetType, setSelectedTargetType] = React.useState(TARGET_TYPES[0].value);
  const [targetValue, setTargetValue] = React.useState('');
  const [targetUnit, setTargetUnit] = React.useState('');
  const [weekdays, setWeekdays] = React.useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });
  
  // Haftanın günlerini seç/kaldır
  const toggleWeekday = (day) => {
    setWeekdays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Alışkanlık kaydet
  const saveHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Hata', 'Lütfen bir alışkanlık adı girin.');
      return;
    }
    
    if (selectedTargetType === 'quantity' && (!targetValue || !targetUnit)) {
      Alert.alert('Hata', 'Lütfen hedef değer ve birimi girin.');
      return;
    }
    
    if (selectedFrequency === 'weekly' && !Object.values(weekdays).some(v => v)) {
      Alert.alert('Hata', 'Lütfen en az bir gün seçin.');
      return;
    }
    
    // Burada gerçek kaydetme işlemi yapılacak
    Alert.alert(
      'Başarılı', 
      'Alışkanlık başarıyla eklendi!',
      [{ text: 'Tamam', onPress: () => router.back() }]
    );
  };
  
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen 
        options={{
          title: "Yeni Alışkanlık",
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
              onPress={saveHabit}
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
            <CardTitle className="text-lg">Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-2 text-foreground/70">Alışkanlık Adı</Text>
            <TextInput
              value={habitName}
              onChangeText={setHabitName}
              placeholder="Örn: Su İçmek, Egzersiz, Okuma..."
              className="border border-border rounded-md p-3 mb-4 text-foreground bg-background"
              placeholderTextColor="#9ca3af"
            />
            
            <Text className="mb-2 text-foreground/70">Renk</Text>
            <View className="flex-row flex-wrap mb-4">
              {COLOR_OPTIONS.map(color => (
                <TouchableOpacity
                  key={color.value}
                  onPress={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-full m-1 items-center justify-center border-2 ${selectedColor === color.value ? 'border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <Check size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Tekrarlama</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-2 text-foreground/70">Frekans</Text>
            <View className="flex-row flex-wrap mb-4">
              {FREQUENCY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedFrequency(option.value)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${selectedFrequency === option.value ? 'bg-primary/10 border border-primary' : 'bg-muted/50 border border-border'}`}
                >
                  <Text className={selectedFrequency === option.value ? 'text-primary' : 'text-foreground/70'}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedFrequency === 'weekly' && (
              <View className="mb-4">
                <Text className="mb-2 text-foreground/70">Günler</Text>
                <View className="flex-row justify-between">
                  {[
                    { key: 'monday', label: 'Pzt' },
                    { key: 'tuesday', label: 'Sal' },
                    { key: 'wednesday', label: 'Çar' },
                    { key: 'thursday', label: 'Per' },
                    { key: 'friday', label: 'Cum' },
                    { key: 'saturday', label: 'Cmt' },
                    { key: 'sunday', label: 'Paz' },
                  ].map(day => (
                    <TouchableOpacity
                      key={day.key}
                      onPress={() => toggleWeekday(day.key)}
                      className={`w-10 h-10 rounded-full items-center justify-center ${weekdays[day.key] ? 'bg-primary' : 'bg-muted/50'}`}
                    >
                      <Text className={weekdays[day.key] ? 'text-primary-foreground' : 'text-foreground/70'}>
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Hedef</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-2 text-foreground/70">Hedef Tipi</Text>
            <View className="flex-row flex-wrap mb-4">
              {TARGET_TYPES.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedTargetType(option.value)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${selectedTargetType === option.value ? 'bg-primary/10 border border-primary' : 'bg-muted/50 border border-border'}`}
                >
                  <Text className={selectedTargetType === option.value ? 'text-primary' : 'text-foreground/70'}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedTargetType === 'quantity' && (
              <View>
                <Text className="mb-2 text-foreground/70">Hedef Değer</Text>
                <View className="flex-row mb-4">
                  <TextInput
                    value={targetValue}
                    onChangeText={setTargetValue}
                    placeholder="Ör: 8"
                    keyboardType="numeric"
                    className="flex-1 border border-border rounded-md p-3 mr-2 text-foreground bg-background"
                    placeholderTextColor="#9ca3af"
                  />
                  <TextInput
                    value={targetUnit}
                    onChangeText={setTargetUnit}
                    placeholder="Birim (bardak, sayfa vb.)"
                    className="flex-1 border border-border rounded-md p-3 text-foreground bg-background"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            )}
          </CardContent>
        </Card>
        
        <Button
          className="bg-primary mb-10"
          onPress={saveHabit}
        >
          <Text className="text-primary-foreground">Alışkanlık Ekle</Text>
        </Button>
      </ScrollView>
    </View>
  );
} 