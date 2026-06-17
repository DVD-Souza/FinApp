import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AnimatedTabBar from './AnimatedTabBar';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: 'pie-chart',
  Transações: 'list',
  Relatórios: 'bar-chart',
  Configurações: 'settings',
};

export default function TabNavigator() {
  const [hideTabBar, setHideTabBar] = useState(false);

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <AnimatedTabBar {...props} hideTabBar={hideTabBar} />
      )}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          height: 64,
          borderRadius: 28,
          backgroundColor: colors.card,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 0,
          elevation: 8,
        },

        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
          margin: 0,
        },

        tabBarIconStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={ICONS[route.name]}
            size={focused ? 26 : 24}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => (
          <DashboardScreen
            {...props}
            setHideTabBar={setHideTabBar}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Transações">
        {(props) => (
          <TransactionsScreen
            {...props}
            setHideTabBar={setHideTabBar}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
      />

      <Tab.Screen name="Configurações">
        {(props) => (
          <SettingsScreen
            {...props}
            setHideTabBar={setHideTabBar}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}