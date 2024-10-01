// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RecipeProvider } from './context/RecipeContext';
import HomeScreen from './screens/HomeScreen';
import RecipeScreen from './screens/RecipeScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';
import LoadingScreen from './screens/LoadingScreen';  // Loading screen
import WelcomeScreen from './screens/WelcomeScreen';  // Import WelcomeScreen

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);

  // Simulate loading for 2 seconds before showing the Welcome screen
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading
  }, []);

  return (
    <RecipeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loading ? (
            <Stack.Screen name="Loading" component={LoadingScreen} />
          ) : (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Recipe" component={RecipeScreen} />
              <Stack.Screen name="MyRecipes" component={MyRecipesScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </RecipeProvider>
  );
}
