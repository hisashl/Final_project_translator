import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditScreen from './EditScreen'; // Asegúrate de que estas rutas sean correctas
import TextScreen from './TextScreen';
import PhotoScreen from './PhotoScreen';
import MicrophoneScreen from './MicrophoneScreen';
import { useStyle } from './StyleContext'; // Asegúrate de que la ruta de importación sea correcta


const Tab = createBottomTabNavigator();

const tabArr = [
  { route: 'Photo', component: PhotoScreen, icon: require('../assets/icons/camera_icon.png') },
  { route: 'Edit', component: EditScreen, icon: require('../assets/icons/edit_icon.png') },
  { route: 'Text', component: TextScreen, icon: require('../assets/icons/text_icon.png') },
  
  { route: 'Microphone', component: MicrophoneScreen, icon: require('../assets/icons/microphone_icon.png') },
];

const createAnimatedStyles = (focused) => {
  return useAnimatedStyle(() => {
    return { transform: [{ scale: withSpring(focused ? 1.3 : 1) }] };
  });
};

export default function HomeScreen() {
  const { styler, theme, toggleTheme } = useStyle();
 

  // Define estilos dentro del componente
  const styles = StyleSheet.create({
    iconContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20,
    },
    tabBar: {
      height: 60,
      position: 'absolute',
      bottom: 20,
      right: 16,
      left: 16,
      borderRadius: 10,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      borderColor: 'white', // Color del contorno
      borderWidth: .25, // Grosor del contorno
      elevation: 1,
    },
    icon: {
      width: 30,
      height: 40,
      resizeMode: 'contain',
    },
    iconFocused: {
      tintColor: '#007AFF',
    },
    iconUnfocused: {
      tintColor: theme === 'light' ? 'black' : 'white',
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {tabArr.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.route}
          component={item.component}
          options={{
            tabBarIcon: ({ focused }) => {
              const animatedStyles = createAnimatedStyles(focused);
              return (
                <View style={styles.iconContainer}>
                  <Animated.View style={animatedStyles}>
                    <Image source={item.icon} style={[styles.icon, focused ? styles.iconFocused : styles.iconUnfocused]} />
                  </Animated.View>
                </View>
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
