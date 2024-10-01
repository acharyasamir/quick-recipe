// screens/MyRecipesScreen.js

import React, { useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RecipeContext } from '../context/RecipeContext';

export default function MyRecipesScreen() {
  const { savedRecipes } = useContext(RecipeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Recipes</Text>
      {savedRecipes.length === 0 ? (
        <Text style={styles.emptyText}>No recipes saved yet.</Text>
      ) : (
        <FlatList
          data={savedRecipes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Text style={styles.dishName}>{item.dishName}</Text>
              <ScrollView style={styles.recipeTextContainer}>
                <Text style={styles.recipeText}>{item.recipe}</Text>
              </ScrollView>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Styles for MyRecipesScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 50,
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 10,
  },
  recipeTextContainer: {
    maxHeight: 200,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});