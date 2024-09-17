import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Gemini API SDK
import Constants from 'expo-constants';

// Sample data for popular dishes displayed as suggestions
const popularDishes = [
  { id: '1', name: 'Spaghetti Bolognese' },
  { id: '2', name: 'Chicken Curry' },
  { id: '3', name: 'Beef Stroganoff' },
];

export default function App() {
  // State to store the user's input for the dish name
  const [dish, setDish] = useState('');
  // State to store the API response (recipe and ingredients)
  const [response, setResponse] = useState('');
  // State to indicate loading status during API call
  const [loading, setLoading] = useState(false);

  // Function to call the Gemini API and fetch a recipe for the dish
  const fetchRecipeFromGemini = async () => {
    setLoading(true); // Set loading to true when API call begins
    const prompt = `Please generate a list of ingredients and a recipe to prepare ${dish}.`;

    try {
      const apiKey = '';
      // Initialize the Google Gemini API client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Send the dish prompt to the API and get the generated content (recipe)
      const result = await model.generateContent(prompt);
      setResponse(result.response.text()); // Store the response text in state
    } catch (error) {
      console.error('Error fetching recipe:', error); // Log the error for debugging
      setResponse('Failed to fetch recipe.'); // Provide feedback to the user in case of failure
    } finally {
      setLoading(false); // Reset loading state after API call completes
    }
  };

  // Function to handle the 'Cook Now' button click
  const handleCookNow = () => {
    if (dish.trim()) {
      // Only call the API if a valid dish name is entered
      fetchRecipeFromGemini();
    } else {
      // Show a message if no dish name is provided
      setResponse('Please enter a dish name.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background image for the app's main view */}
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
        }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Overlay to darken the background image for better text readability */}
        <View style={styles.overlay}>
          {/* Scrollable content area */}
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* App title and tagline */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Quick Recipe</Text>
              <Text style={styles.tagline}>Your Personal Recipe Finder</Text>
            </View>

            {/* Input field for the dish name */}
            <View style={styles.inputCard}>
              <Text style={styles.inputPrompt}>What would you like to cook?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a dish name..."
                placeholderTextColor="#ccc"
                value={dish}
                onChangeText={setDish} // Update state with user's input
              />
              {/* Horizontal list of popular dish suggestions */}
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

            {/* Button to trigger the recipe generation */}
            <TouchableOpacity
              style={styles.cookNowButton}
              onPress={handleCookNow}
              disabled={loading}
            >
              <Text style={styles.cookNowText}>
                {loading ? 'Generating...' : 'Cook Now!'}
              </Text>
            </TouchableOpacity>

            {/* Display the API response (recipe or error message) */}
            {response ? (
              <View style={styles.responseContainer}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </ImageBackground>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

// Styles for the app
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Increased opacity for better readability
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
    marginBottom: 30,
  },
  cookNowText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  responseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
  },
  responseText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },
});
