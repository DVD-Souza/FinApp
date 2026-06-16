import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export default function AnimatedTabBar({ hideTabBar, ...props }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: hideTabBar ? 120 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [hideTabBar]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
      }}
    >
      <BottomTabBar {...props} />
    </Animated.View>
  );
}
