import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FinanceProvider } from './src/context/FinanceContext';
import AppNavigator from './src/navigation/AppNavigator';

import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  useEffect(() => {
    const setupSystemBars = async () => {
      try {
        await NavigationBar.setPositionAsync('absolute');
        await NavigationBar.setBackgroundColorAsync('#00000000');
      } catch (error) {
        console.warn(error);
      }
    };

    setupSystemBars();
  }, []);

  return (
    <FinanceProvider>
      <NavigationContainer>
        <StatusBar style="auto" translucent />
        <AppNavigator />
      </NavigationContainer>
    </FinanceProvider>
  );
}