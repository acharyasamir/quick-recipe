// screens/HomeScreen.js

import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RecipeContext } from '../context/RecipeContext';

// Sample data for popular dishes displayed as suggestions
const popularDishes = [
  { id: '1', name: 'Spaghetti Bolognese' },
  { id: '2', name: 'Chicken Curry' },
  { id: '3', name: 'Beef Stroganoff' },
];

export default function HomeScreen() {
  const [dish, setDish] = useState('');
  const navigation = useNavigation();
  const { savedRecipes } = useContext(RecipeContext);

  // Function to navigate to Recipe Screen
  const handleCookNow = () => {
    if (dish.trim()) {
      navigation.navigate('Recipe', { dishName: dish });
    } else {
      alert('Please enter a dish name.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background image */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Quick Recipe</Text>
              <Text style={styles.tagline}>Your Personal Recipe Finder</Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputCard}>
              <Text style={styles.inputPrompt}>What would you like to cook?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a dish name..."
                placeholderTextColor="#ccc"
                value={dish}
                onChangeText={setDish}
              />

              {/* Popular Dishes */}
              <FlatList
                data={popularDishes}
                horizontal
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.dishList}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dishCard}
                    onPress={() => setDish(item.name)}
                  >
                    <Text style={styles.dishText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.cookNowButton} onPress={handleCookNow}>
              <Text style={styles.cookNowText}>Cook Now!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.myRecipesButton}
              onPress={() => navigation.navigate('MyRecipes')}
            >
              <Text style={styles.myRecipesText}>My Recipes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

// Styles for HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 20,
    color: '#ddd',
  },
  inputCard: {
    marginBottom: 30,
  },
  inputPrompt: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dishList: {
    flexGrow: 0,
  },
  dishCard: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginRight: 10,
  },
  dishText: {
    fontSize: 16,
    color: '#333',
  },
  cookNowButton: {
    backgroundColor: '#FF6347',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  cookNowText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  myRecipesButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  myRecipesText: {
    color: '#FF6347',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
