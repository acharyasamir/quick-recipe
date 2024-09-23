// context/RecipeContext.js

import React, { createContext, useState } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);

  const saveRecipe = (dishName, recipe) => {
    setSavedRecipes([...savedRecipes, { dishName, recipe }]);
  };

  return (
    <RecipeContext.Provider value={{ savedRecipes, saveRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
