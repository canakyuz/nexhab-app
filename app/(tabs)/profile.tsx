import * as React from 'react';
import { View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { 
  LogOut, 
  Settings, 
  ChevronRight, 
  Bell, 
  Moon, 
  HelpCircle,
  Shield,
  LineChart,
  Award
} from 'lucide-react-native';
import { ThemeToggle } from '~/components/ThemeToggle';

// Geçici kullanıcı verisi
const USER = {
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  avatar: 'https://i.pravatar.cc/150?img=32',
  joinDate: '2023-06-15',
  streakDays: 28,
  completedHabits: 154,
  completedTasks: 89,
};

// Son günlerde tamamlanan alışkanlık sayısı
const STREAK_DATA = [5, 4, 6, 3, 5, 4, 7];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  
  // Kullanıcı katılım tarihini formatla
  const formattedJoinDate = React.useMemo(() => {
    const date = new Date(USER.joinDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  }, [USER.joinDate]);
  
  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Profil Başlığı */}
      <View className="items-center mb-6">
        <Avatar className="w-24 h-24 mb-3" alt={USER.name}>
          <AvatarImage source={{ uri: USER.avatar }} />
          <AvatarFallback>
            <Text className="text-xl">{USER.name.split(' ').map(n => n[0]).join('')}</Text>
          </AvatarFallback>
        </Avatar>
        <Text className="text-2xl font-bold">{USER.name}</Text>
        <Text className="text-foreground/70">{USER.email}</Text>
        <Text className="text-foreground/50 text-sm mt-1">Üyelik: {formattedJoinDate}</Text>
      </View>
      
      {/* İstatistikler */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">İstatistikler</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex-row justify-between">
            <View className="items-center">
              <View className="w-10 h-10 bg-sky-100 dark:bg-sky-900 rounded-full items-center justify-center mb-1">
                <Award size={20} color="#0284c7" />
              </View>
              <Text className="text-xl font-semibold">{USER.streakDays}</Text>
              <Text className="text-xs text-foreground/70">Günlük Seri</Text>
            </View>
            
            <View className="items-center">
              <View className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full items-center justify-center mb-1">
                <LineChart size={20} color="#059669" />
              </View>
              <Text className="text-xl font-semibold">{USER.completedHabits}</Text>
              <Text className="text-xs text-foreground/70">Alışkanlık</Text>
            </View>
            
            <View className="items-center">
              <View className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mb-1">
                <Shield size={20} color="#7c3aed" />
              </View>
              <Text className="text-xl font-semibold">{USER.completedTasks}</Text>
              <Text className="text-xs text-foreground/70">Görev</Text>
            </View>
          </View>
          
          {/* Son 7 günlük seri grafiği */}
          <View className="mt-4 pt-4 border-t border-border">
            <Text className="text-sm text-foreground/70 mb-2">Son 7 gün performansı</Text>
            <View className="flex-row justify-between h-20 items-end">
              {STREAK_DATA.map((value, index) => (
                <View key={index} className="flex-1 items-center">
                  <View 
                    style={{ height: `${(value / Math.max(...STREAK_DATA)) * 100}%` }}
                    className="w-4 bg-sky-600 rounded-t"
                  />
                  <Text className="text-xs text-foreground/50 mt-1">
                    {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </CardContent>
      </Card>
      
      {/* Ayarlar */}
      <Text className="text-lg font-semibold mb-3">Ayarlar</Text>
      
      {/* Bildirimler */}
      <Card className="mb-3">
        <CardContent className="py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full items-center justify-center mr-3">
                <Bell size={18} color="#0284c7" />
              </View>
              <Text>Bildirimler</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={notificationsEnabled ? '#0284c7' : '#f4f4f5'}
            />
          </View>
        </CardContent>
      </Card>
      
      {/* Tema */}
      <Card className="mb-3">
        <CardContent className="py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
                <Moon size={18} color="#7c3aed" />
              </View>
              <Text>Tema</Text>
            </View>
            <ThemeToggle />
          </View>
        </CardContent>
      </Card>
      
      {/* Yardım */}
      <Card className="mb-3">
        <CardContent className="py-3">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full items-center justify-center mr-3">
                <HelpCircle size={18} color="#059669" />
              </View>
              <Text>Yardım ve Destek</Text>
            </View>
            <ChevronRight size={18} className="text-foreground/50" />
          </TouchableOpacity>
        </CardContent>
      </Card>
      
      {/* Hesap Ayarları */}
      <Card className="mb-3">
        <CardContent className="py-3">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full items-center justify-center mr-3">
                <Settings size={18} color="#d97706" />
              </View>
              <Text>Hesap Ayarları</Text>
            </View>
            <ChevronRight size={18} className="text-foreground/50" />
          </TouchableOpacity>
        </CardContent>
      </Card>
      
      {/* Çıkış Yap */}
      <Button 
        variant="outline" 
        className="border-dashed mt-6 mb-10"
        onPress={() => {
          // Çıkış yapma işlemi
        }}
      >
        <LogOut size={16} className="text-foreground mr-2" />
        <Text>Çıkış Yap</Text>
      </Button>
    </ScrollView>
  );
} 