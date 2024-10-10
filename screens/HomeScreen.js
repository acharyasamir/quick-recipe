import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Gemini API SDK

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch recommended recipes when the component mounts
    fetchRecommendedRecipes();
  }, []);

  const fetchRecommendedRecipes = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      if (response.data && response.data.meals) {
        setMeals(response.data.meals);
      } else {
        alert('No recommended recipes found');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes');
    }
  };

// Function to fetch the recipe from Gemini API
const fetchRecipeFromGemini = async () => {
  const prompt = `Please generate a list of ingredients and a recipe to prepare ${query}. 
  Provide the ingredients as a list and the instructions without numbering. Respond in JSON format 
  with keys "ingredients" and "instructions". If the input is invalid, return a JSON object with 
  an error message like "Please enter a valid dish name."`;

  setLoading(true);  // Set loading state

  try {
    const apiKey = '';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    let recipeResponse = result.response.text();

    // Handle Gemini response that may be wrapped in backticks
    if (recipeResponse.startsWith('```json')) {
      recipeResponse = recipeResponse.replace(/```json|```/g, ''); // Clean up backticks
    }

    // Parse the Gemini response
    try {
      const parsedResponse = JSON.parse(recipeResponse);
      if (parsedResponse.error) {
        Alert.alert('Error', parsedResponse.error);  // Handle invalid input
      } else {
        // Navigate to RecipeScreen and pass the generated recipe
        navigation.navigate('Recipe', { dishName: query, ingredients: parsedResponse.ingredients, instructions: parsedResponse.instructions });
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      Alert.alert('Error', 'Gemini returned invalid response.');
    }
  } catch (error) {
    console.error('Error fetching recipe from Gemini:', error);
    Alert.alert('Error', 'Failed to fetch recipe.');
  } finally {
    setLoading(false);  // Clear loading state
  }
};


const handleGenerateRecipe = () => {
  if (query.trim() === '') {
    Alert.alert('Error', 'Please enter a valid recipe name');
    return;
  }

  // Use Gemini API for generating the recipe
  fetchRecipeFromGemini();
};


  const renderRecommendedDish = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Recipe', { dishName: item.strMeal })}>
      <Image source={{ uri: item.strMealThumb }} style={styles.recommendationImage} />
      <Text style={styles.recommendationText}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header Text */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Quick Recipe</Text>
          <Text style={styles.headerSubtitle}>Your Own Recipe Finder</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search for a recipe..."
              placeholderTextColor="#aaa"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRecipe}>
              <Text style={styles.generateButtonText}>{loading ? 'Generating...' : 'Generate'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Dishes Section */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>Recommended Recipes</Text>
          <FlatList
            data={meals}
            numColumns={2}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderRecommendedDish}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.recommendationList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginHorizontal: 20,
    marginTop: 40,
    alignItems: 'center', 
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f64e32',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#f64e32',
  },
  searchContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#f64e32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationSection: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendationList: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  recommendationImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});
