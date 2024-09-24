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

  // Function to parse and clean the API response
  const cleanAndParseResponse = (responseText) => {
    // Remove markdown symbols like **, ##, etc.
    let cleanedText = responseText
      .replace(/(\*\*|##|#)/g, '')  // Remove bold and headings
      .replace(/^\s*\n/gm, '');     // Remove extra newlines

    // Split ingredients and instructions by detecting keywords
    const ingredientsStartIndex = cleanedText.indexOf('Ingredients:');
    const instructionsStartIndex = cleanedText.indexOf('Instructions:');
    
    const ingredientsText = cleanedText.substring(ingredientsStartIndex, instructionsStartIndex).replace('Ingredients:', '').trim();
    const instructionsText = cleanedText.substring(instructionsStartIndex).replace('Instructions:', '').trim();

    // Split the ingredients and instructions into arrays for easier rendering
    const ingredients = ingredientsText.split('\n').map(item => item.trim()).filter(Boolean);
    const instructions = instructionsText.split('\n').map(item => item.trim()).filter(Boolean);

    return { ingredients, instructions };
  };

  // Function to call the Gemini API and fetch the recipe
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
          <FlatList
            data={response.ingredients}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.ingredientBox}>
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            )}
            horizontal={false} // Vertically stacked ingredient boxes
            numColumns={2} // Display in two columns
            contentContainerStyle={styles.ingredientsList}
          />

          {/* Render Instructions */}
          <Text style={styles.sectionTitle}>Instructions:</Text>
          {response.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instructionText}>{`${index + 1}. ${instruction}`}</Text>
          ))}

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
    color: '#333',
  },
  ingredientsList: {
    marginBottom: 20,
  },
  ingredientBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E6F2FF',
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
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
