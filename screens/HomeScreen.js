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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [meals, setMeals] = useState([]);
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

  const handleGenerateRecipe = () => {
    if (query.trim() === '') {
      alert('Please enter a valid recipe name');
      return;
    }
    navigation.navigate('Recipe', { dishName: query });
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
              <Text style={styles.generateButtonText}>Generate</Text>
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
    marginTop: 40,  // Add more margin from the top
    alignItems: 'center', // Center the text
  },
  headerTitle: {
    fontSize: 28,  // Larger font for the title
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