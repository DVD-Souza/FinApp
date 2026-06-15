import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar from './AnimatedTabBar';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [hideTabBar, setHideTabBar] = useState(false);

  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} hideTabBar={hideTabBar} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 28,
          height: 64,
          backgroundColor: colors.card,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'pie-chart',
            Transações: 'list',
            Relatórios: 'bar-chart',
            Configurações: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => <DashboardScreen {...props} setHideTabBar={setHideTabBar} />}
      </Tab.Screen>

      <Tab.Screen name="Transações">
        {(props) => <TransactionsScreen {...props} setHideTabBar={setHideTabBar} />}
      </Tab.Screen>

      <Tab.Screen name="Relatórios" component={ReportsScreen} />

      <Tab.Screen name="Configurações">
        {(props) => <SettingsScreen {...props} setHideTabBar={setHideTabBar} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
``