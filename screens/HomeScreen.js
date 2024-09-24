import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';  // For icons
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder image URL for recommended dishes
const placeholderImageUrl = 'https://www.allrecipes.com/thmb/mvO1mRRH1zTz1SvbwBCTz78CRJI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/67700_RichPastaforthePoorKitchen_ddmfs_4x3_2284-220302ec8328442096df370dede357d7.jpg';

// Sample data for recommended dishes
const recommendedDishes = [
  { id: '1', name: 'Spaghetti Bolognese', imageUrl: placeholderImageUrl },
  { id: '2', name: 'Chicken Curry', imageUrl: placeholderImageUrl },
  { id: '3', name: 'Creamy Pasta', imageUrl: placeholderImageUrl },
  { id: '4', name: 'Grilled Salmon', imageUrl: placeholderImageUrl },
  { id: '5', name: 'Vegetarian Stir Fry', imageUrl: placeholderImageUrl },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const handleGenerateRecipe = () => {
    if (query.trim()) {
      navigation.navigate('Recipe', { dishName: query });
    } else {
      alert('Please enter a recipe query.');
    }
  };

  const renderRecommendedDish = ({ item }) => (
    <TouchableOpacity style={styles.recommendationCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.recommendationImage} />
      <Text style={styles.recommendationText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://example.com/your-background-image.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Header Section */}
            <Text style={styles.title}>Quick Recipe</Text>
            <Text style={styles.tagline}>Your Personal Recipe Finder</Text>

            {/* Recipe Query Input */}
            <View style={styles.inputCard}>
              <Text style={styles.inputPrompt}>Generate Recipe</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a recipe..."
                placeholderTextColor="#ccc"
                value={query}
                onChangeText={setQuery}
              />
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRecipe}>
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>

            {/* Recommended Dishes */}
            <Text style={styles.recommendationTitle}>Recommended for You</Text>
            <FlatList
              data={recommendedDishes}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={renderRecommendedDish}
              contentContainerStyle={styles.recommendationList}
            />
          </ScrollView>

          {/* Bottom Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabItem}>
              <FontAwesome name="home" size={28} color="#FF6347" />
              <Text style={styles.tabText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
              <FontAwesome name="heart" size={28} color="#FF6347" />
              <Text style={styles.tabText}>Saved Recipes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Styles for HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 20,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputCard: {
    marginBottom: 30,
    alignItems: 'center',
  },
  inputPrompt: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#FF6347',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginLeft: 20,
  },
  recommendationList: {
    paddingLeft: 20,
  },
  recommendationCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recommendationText: {
    marginTop: 5,
    fontSize: 14,
    color: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#FF6347',
    marginTop: 5,
  },
});
