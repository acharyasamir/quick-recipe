// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import the RecipeProvider
import { RecipeProvider } from './context/RecipeContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import RecipeScreen from './screens/RecipeScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <RecipeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Hide default headers
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Recipe" component={RecipeScreen} />
          <Stack.Screen name="MyRecipes" component={MyRecipesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  );
}
