// screens/RecipeScreen.js

import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RecipeContext } from '../context/RecipeContext';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Gemini API SDK

export default function RecipeScreen() {
  const route = useRoute();
  const { dishName } = route.params;
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const { saveRecipe } = useContext(RecipeContext);

  // Function to call the Gemini API and fetch a recipe for the dish
  const fetchRecipeFromGemini = async () => {
    const prompt = `Please generate a list of ingredients and a recipe to prepare ${dishName}.`;

    try {
      const apiKey = 'AIzaSyA5LJqA40iZuNb-A8oO4JPQcbYgyOyST4I'; // Replace with your API key
      // Initialize the Google Gemini API client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Send the dish prompt to the API and get the generated content (recipe)
      const result = await model.generateContent(prompt);
      const recipeText = result.response.text();
      setResponse(recipeText); // Store the response text in state
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setResponse('Failed to fetch recipe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeFromGemini();
  }, []);

  // Function to save the recipe
  const handleSaveRecipe = () => {
    saveRecipe(dishName, response);
    alert('Recipe saved!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6347" />
        ) : (
          <>
            <Text style={styles.dishName}>{dishName}</Text>
            <Text style={styles.recipeText}>{response}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
              <Text style={styles.saveButtonText}>Save Recipe</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Styles for RecipeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  contentContainer: {
    padding: 20,
  },
  dishName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#FF6347',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
