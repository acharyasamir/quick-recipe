import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
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

  // Function to clean and parse the API response
  const cleanAndParseResponse = (responseText) => {
    let cleanedText = responseText
      .replace(/(\*\*|##|#)/g, '')  // Remove bold and headings
      .replace(/^\s*\n/gm, '')      // Remove extra newlines

    const ingredientsStartIndex = cleanedText.indexOf('Ingredients:');
    const instructionsStartIndex = cleanedText.indexOf('Instructions:');
    
    const ingredientsText = cleanedText.substring(ingredientsStartIndex, instructionsStartIndex).replace('Ingredients:', '').trim();
    const instructionsText = cleanedText.substring(instructionsStartIndex).replace('Instructions:', '').trim();

    const ingredients = ingredientsText.split('\n').map(item => item.replace(/^\*\s*/, '').trim()).filter(Boolean);
    const instructions = instructionsText.split('\n').map(item => item.trim()).filter(Boolean);

    return { ingredients, instructions };
  };

  // Function to fetch the recipe from Gemini API
  const fetchRecipeFromGemini = async () => {
    const prompt = `Please generate a list of ingredients and a recipe to prepare ${dishName}.`;

    try {
      const apiKey = ''; // Replace with your API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(prompt);
      const recipeText = result.response.text(); // Ensure this part is correct based on SDK

      const parsedResponse = cleanAndParseResponse(recipeText);
      setResponse(parsedResponse);
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
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.dishName}>{dishName}</Text>

          {/* Render Ingredients */}
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          <View style={styles.ingredientSection}>
            {response.ingredients.map((ingredient, index) => (
              <Text key={index} style={ingredient.startsWith('For the') ? styles.subSectionTitle : styles.ingredientText}>
                {ingredient}
              </Text>
            ))}
          </View>

          {/* Render Instructions */}
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <View style={styles.instructionsSection}>
            {response.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>{`${index + 1}. ${instruction}`}</Text>
            ))}
          </View>

          {/* Save Recipe Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  dishName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginVertical: 15,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  ingredientSection: {
    backgroundColor: '#FFF0E0', // Light orange background for ingredients section
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  ingredientText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  instructionsSection: {
    backgroundColor: '#EFEFEF', // Light gray background for instructions section
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 10,
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
