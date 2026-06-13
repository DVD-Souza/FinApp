import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FinanceProvider } from './src/context/FinanceContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <FinanceProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </FinanceProvider>
  );
}