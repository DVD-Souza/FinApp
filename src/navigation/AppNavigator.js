import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AddEditTransactionScreen from '../screens/AddEditTransactionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="AddEdit" component={AddEditTransactionScreen} options={{ title: 'Nova Transação' }} />
    </Stack.Navigator>
  );
}