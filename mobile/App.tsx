import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';

// Screens
import DatingScreen from './src/screens/DatingScreen';
import MatchmakingScreen from './src/screens/MatchmakingScreen';
import BlindScreen from './src/screens/BlindScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Icons
import { Flame, Users, EyeOff, MessageCircle, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#0B0F19',
                borderTopColor: '#1F2E4D',
                borderTopWidth: 1,
                height: 64,
                paddingBottom: 8,
                paddingTop: 8,
              },
              tabBarActiveTintColor: '#F43F5E',
              tabBarInactiveTintColor: '#64748B',
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '600',
              },
            }}
          >
            <Tab.Screen
              name="Dating"
              component={DatingScreen}
              options={{
                tabBarIcon: ({ color, size }) => <Flame color={color} size={20} />,
              }}
            />
            <Tab.Screen
              name="Matchmaker"
              component={MatchmakingScreen}
              options={{
                tabBarIcon: ({ color, size }) => <Users color={color} size={20} />,
              }}
            />
            <Tab.Screen
              name="Blind"
              component={BlindScreen}
              options={{
                tabBarIcon: ({ color, size }) => <EyeOff color={color} size={20} />,
              }}
            />
            <Tab.Screen
              name="Messages"
              component={ChatScreen}
              options={{
                tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={20} />,
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => <User color={color} size={20} />,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C16',
  },
});
