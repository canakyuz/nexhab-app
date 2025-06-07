import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ListChecks, Calendar, User } from 'lucide-react-native';
import { initializeDatabase } from './lib/db';
import HomeScreen from './screens/HomeScreen';
import HabitsScreen from './screens/HabitsScreen';
import TasksScreen from './screens/TasksScreen';
import ProfileScreen from './screens/ProfileScreen';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Uygulama yükleniyor...</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
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
            }
            
            return (
              <View style={styles.tabIconContainer}>
                <View 
                  style={[
                    styles.tabIconBackground, 
                    focused && { backgroundColor: 'rgba(52, 152, 219, 0.1)' }
                  ]}
                >
                  {icon}
                </View>
                <Text style={{ color, fontSize: 11, marginTop: 4 }}>
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#a0a0a0',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
        <Tab.Screen name="Alışkanlıklar" component={HabitsScreen} />
        <Tab.Screen name="Görevler" component={TasksScreen} />
        <Tab.Screen name="Profil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  // Tab bar stili
  tabBar: {
    height: 70,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  // Tab icon container
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBackground: {
    padding: 8,
    borderRadius: 16,
  },
  // Header stili
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
}); 