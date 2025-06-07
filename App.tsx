import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ListChecks, Calendar, User, Plus, Bell } from 'lucide-react-native';
import { initializeDatabase } from './lib/db';
import HomeScreen from './screens/HomeScreen';
import HabitsScreen from './screens/HabitsScreen';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AddActionSheet } from './components/AddActionSheet';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function TabBarCenterButton({ onPress }: { onPress?: () => void }) {
  return (
    <View style={styles.tabBarCenterButtonContainer}>
      <TouchableOpacity 
        style={styles.tabBarCenterButton} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function EmptyPlaceholderComponent() {
  return <View style={{ flex: 1 }} />;
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFabPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleAddNewHabit = () => {
    setIsModalVisible(false);
    // Yeni alışkanlık ekleme ekranına yönlendir
    // TODO: navigate to add habit screen
  };

  const handleQuitBadHabit = () => {
    setIsModalVisible(false);
    // Kötü alışkanlık bırakma ekranına yönlendir
    // TODO: navigate to quit habit screen
  };

  const handleAddMood = () => {
    setIsModalVisible(false);
    // Ruh hali ekleme işlemini yap
    // TODO: handle mood tracking
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Veritabanını başlat
        await initializeDatabase();

        // Uygulama hazır
        setIsReady(true);
      } catch (e) {
        console.warn('Uygulama başlatma hatası:', e);
        setError('Uygulama başlatılırken bir hata oluştu.');
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Animated.View 
            style={styles.loadingContainer}
            entering={FadeIn.duration(400)}
          >
            <ActivityIndicator size="large" color="hsl(221, 83%, 53%)" />
            <Text style={styles.loadingText}>Uygulama yükleniyor...</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;
            
            if (route.name === 'Ana Sayfa') {
              icon = <Home color={color} size={size} />;
            } else if (route.name === 'Alışkanlıklar') {
              icon = <ListChecks color={color} size={size} />;
            } else if (route.name === 'Görevler') {
              icon = <Calendar color={color} size={size} />;
            } else if (route.name === 'Profil') {
              icon = <User color={color} size={size} />;
            } else if (route.name === 'Bildirimler') {
              icon = <Bell color={color} size={size} />;
            }
            
            return (
              <View style={styles.tabIconContainer}>
                {icon}
                {focused && (
                  <View style={styles.tabIndicator} />
                )}
              </View>
            );
          },
          tabBarActiveTintColor: 'hsl(221, 83%, 53%)',
          tabBarInactiveTintColor: 'hsl(215, 16%, 47%)',
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
        <Tab.Screen name="Alışkanlıklar" component={HabitsScreen} />
        <Tab.Screen 
          name="Ekle" 
          component={EmptyPlaceholderComponent} 
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen name="Görevler" component={TasksScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
      
      <TabBarCenterButton onPress={handleFabPress} />

      <AddActionSheet 
        visible={isModalVisible}
        onClose={handleCloseModal}
        onAddNewHabit={handleAddNewHabit}
        onQuitBadHabit={handleQuitBadHabit}
        onAddMood={handleAddMood}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsl(210, 40%, 98%)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'hsl(215, 16%, 47%)',
  },
  errorText: {
    color: 'hsl(0, 84%, 60%)',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  // Tab bar stili
  tabBar: {
    height: 80,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: 'hsl(222, 47%, 11%)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    position: 'absolute',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 0,
  },
  // Tab icon container
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'hsl(221, 83%, 53%)',
  },
  // Header stili
  header: {
    backgroundColor: 'hsl(210, 40%, 98%)',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
  },
  // Tab Bar Center Button
  tabBarCenterButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30,
    alignSelf: 'center',
    zIndex: 10,
  },
  tabBarCenterButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'hsl(221, 83%, 53%)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'hsl(221, 83%, 53%)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
}); 