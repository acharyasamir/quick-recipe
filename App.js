import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ImageBackground, SafeAreaView, ScrollView } from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the Gemini API SDK
import Constants from 'expo-constants';


// Sample data for popular dishes
const popularDishes = [
  { id: '1', name: 'Spaghetti Bolognese' },
  { id: '2', name: 'Chicken Curry' },
  { id: '3', name: 'Beef Stroganoff' },
];

export default function App() {
  const [dish, setDish] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to call the Gemini API
  const fetchRecipeFromGemini = async () => {
    setLoading(true);
    const prompt = `Please generate a list of ingredients and a recipe to prepare ${dish}.`;

    try {
      const apiKey = Constants.manifest.extra.API_KEY;
// Use the API key in your fetch request
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Send the prompt and get the response
      const result = await model.generateContent(prompt);
      setResponse(result.response.text());
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setResponse('Failed to fetch recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleCookNow = () => {
    if (dish.trim()) {
      fetchRecipeFromGemini();
    } else {
      setResponse('Please enter a dish name.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.overlay}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Quick Recipe</Text>
            <Text style={styles.tagline}>Your Personal Recipe Finder</Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputPrompt}>What would you like to cook?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a dish name..."
              placeholderTextColor="#ccc"
              value={dish}
              onChangeText={setDish}
            />
            <FlatList
              data={popularDishes}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dishCard} onPress={() => setDish(item.name)}>
                  <Text style={styles.dishText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <TouchableOpacity style={styles.cookNowButton} onPress={handleCookNow} disabled={loading}>
            <Text style={styles.cookNowText}>{loading ? 'Generating...' : 'Cook Now!'}</Text>
          </TouchableOpacity>

          <View style={styles.responseContainer}>
            {response ? <Text style={styles.responseText}>{response}</Text> : null}
          </View>
        </ScrollView>
      </ImageBackground>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkens the background image slightly for readability
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 18,
    color: '#ddd',
  },
  inputCard: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  inputPrompt: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dishCard: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
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
    paddingHorizontal: 50,
    alignSelf: 'center',
    marginTop: 30,
  },
  cookNowText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  responseContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  responseText: {
    color: '#333',
    fontSize: 16,
  },
});
