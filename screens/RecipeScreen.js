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
    const prompt = `Please generate a list of ingredients and a recipe to prepare ${dishName}. Give the ingredients as a list. For the instructions, just give instructions for the recipe and no extra information like tips or any other info. Your response will be used in React Native app so it is important to receive a response in a fixed format. Also do not give numbering for the instructions. just give it as separate sentences. Also, please generate your response in whatever the language the input is in.`;

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
          <View style={styles.ingredientsContainer}>
            {response.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          {/* Render Instructions */}
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <View style={styles.instructionsContainer}>
            {response.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {`${index + 1}. ${instruction}`}
              </Text>
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

// Styles for the component
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF6347',
  },
  ingredientsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 18,
    color: '#FF6347', // Orange bullet points
    marginRight: 5,
  },
  ingredientText: {
    fontSize: 18,
    color: '#333',
  },
  instructionsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
  },
  instructionText: {
    fontSize: 18,
    lineHeight: 26,
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
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
