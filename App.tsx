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
  withSpring,
  FadeIn
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
                <Animated.View 
                  style={[
                    styles.tabIconBackground, 
                    focused && styles.tabIconBackgroundActive
                  ]}
                >
                  {icon}
                </Animated.View>
                <Text style={[styles.tabLabel, { color }]}>
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: 'hsl(221, 83%, 53%)',
          tabBarInactiveTintColor: 'hsl(215, 16%, 47%)',
          tabBarStyle: styles.tabBar,
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
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
    height: 76,
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 12,
    position: 'absolute',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: 'hsl(214, 32%, 91%)',
  },
  // Tab icon container
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconBackground: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginBottom: 6,
  },
  tabIconBackgroundActive: {
    backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  // Header stili
  header: {
    backgroundColor: 'hsl(210, 40%, 98%)',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
  },
}); 