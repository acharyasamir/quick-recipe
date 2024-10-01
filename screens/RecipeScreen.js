import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RecipeContext } from '../context/RecipeContext';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import Gemini API SDK

export default function RecipeScreen() {
  const route = useRoute();
  const { dishName } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { saveRecipe } = useContext(RecipeContext);

  // Google Gemini API initialization (replace with your actual API key)
  const apiKey = ''; // Replace with your actual key
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  useEffect(() => {
    validateAndFetchRecipe();
  }, []);

  // Function to validate and fetch recipe
  const validateAndFetchRecipe = async () => {
    try {
      // First prompt to validate the dish name and match it to a valid one
      const prompt = `Translate the following dish name into a valid English dish name, or indicate if it is invalid: '${dishName}'. If valid, provide the recipe in the same language as the input.`;

      const result = await model.generateContent(prompt);
      const validationResponse = result.response.text(); // Handle response from Gemini API

      // Check if Gemini returns a valid dish or an invalid message
      if (validationResponse.includes('Please enter a valid dish name')) {
        setRecipe({ error: 'Please enter a valid dish name' });
        setLoading(false);
        return;
      }

      // Now handle response based on the language
      const isEnglishQuery = /^[A-Za-z\s]*$/.test(dishName); // Check if the query is in English
      
      if (!isEnglishQuery) {
        // If the query is in a different language (e.g., Chinese), return Gemini's response directly
        setRecipe({ geminiRecipe: validationResponse });
        setLoading(false);
        return;
      }

      // If the query is in English, try to fetch the recipe from Gemini API
      const recipePrompt = `Generate a recipe with ingredients and instructions for the dish: '${dishName}'`;
      const recipeResult = await model.generateContent(recipePrompt);
      const recipeText = recipeResult.response.text(); 

      // If Gemini doesn't return a valid recipe, fall back to TheMealDB API
      if (!recipeText || recipeText.includes('no recipe found')) {
        fetchFromMealDB(dishName);
      } else {
        setRecipe({ geminiRecipe: recipeText });
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      fetchFromMealDB(dishName); // Fall back to TheMealDB in case of error
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch recipe from TheMealDB API as fallback
  const fetchFromMealDB = async (dishName) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`);
      setRecipe(response.data.meals ? response.data.meals[0] : { error: 'No recipe found' });
    } catch (error) {
      console.error('Error fetching from MealDB:', error);
      setRecipe({ error: 'Failed to fetch recipe from TheMealDB.' });
    }
  };

  const handleSaveRecipe = () => {
    if (recipe) {
      saveRecipe(dishName, recipe);
      alert('Recipe saved!');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f64e32" />
      </View>
    );
  }

  if (recipe.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{recipe.error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* If the recipe is from Gemini, render it */}
      {recipe.geminiRecipe ? (
        <Text style={styles.instructionsText}>{recipe.geminiRecipe}</Text>
      ) : (
        <>
          {/* Render TheMealDB Recipe */}
          <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
          <Text style={styles.dishName}>{recipe.strMeal}</Text>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <View style={styles.ingredientsContainer}>
            {Object.keys(recipe)
              .filter(key => key.includes('strIngredient') && recipe[key])
              .map((key, index) => {
                const measureKey = `strMeasure${key.replace('strIngredient', '')}`;
                return (
                  <Text key={index} style={styles.ingredientText}>
                    {recipe[key]} - {recipe[measureKey]}
                  </Text>
                );
              })}
          </View>

          {/* Instructions */}
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>{recipe.strInstructions}</Text>
        </>
      )}

      {/* Save Recipe Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
        <Text style={styles.saveButtonText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  dishName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f64e32',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#f64e32',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f64e32',
    fontSize: 18,
  },
});
