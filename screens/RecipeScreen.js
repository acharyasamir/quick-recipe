import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { RecipeContext } from '../context/RecipeContext';

export default function RecipeScreen() {
  const route = useRoute();
  const { dishName } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { saveRecipe } = useContext(RecipeContext);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dishName}`);
      setRecipe(response.data.meals[0]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
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

  const renderIngredients = () => {
    const ingredients = Object.keys(recipe)
      .filter((key) => key.includes('strIngredient') && recipe[key])
      .map((key, index) => {
        const measureKey = `strMeasure${key.replace('strIngredient', '')}`;
        return (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>
              {recipe[key]} - {recipe[measureKey]}
            </Text>
          </View>
        );
      });
    return ingredients;
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.dishName}>{recipe.strMeal}</Text>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      <View style={styles.ingredientsContainer}>{renderIngredients()}</View>

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructionsText}>{recipe.strInstructions}</Text>

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
  ingredientItem: {
    flexDirection: 'row',
    marginBottom: 5,
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
});
