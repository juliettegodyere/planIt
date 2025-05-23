import { shoppingData } from "../data/shoppingListData.js"
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android client ID: 718749830947-mi51a4ggbaopkvfk4g3pknt3bq3d5m6u.apps.googleusercontent.com
// IOS Client ID: 718749830947-15fiuodcrenfveajk45uq0emn9fle5tl.apps.googleusercontent.com

  export const loadUserDefinedItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("userDefinedItems");
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Failed to load user-defined items:", error);
      return [];
    }
  };

  export const getShoppingItems = async (categoryValue: string) => {
    const userDefinedItems = await loadUserDefinedItems();
    const categories = [...shoppingData.categories];
  
    const selectedCategory = categories.find(cat => cat.value === categoryValue);
  
    if (!selectedCategory) {
      console.warn(`Category "${categoryValue}" not found.`);
      return [];
    }
  
    return {
      ...selectedCategory,
      items: [...selectedCategory.items, ...userDefinedItems],
    };
  };
  

  export const saveUserDefinedItem = async (label: string, selectedCategoryValue: string) => {
    try {
      const userDefinedItems = await loadUserDefinedItems();
      const newItem = {
        label,
        value: `item-${Date.now()}`,
        category: selectedCategoryValue,
      };
      const updatedItems = [...userDefinedItems, newItem];
      await AsyncStorage.setItem("userDefinedItems", JSON.stringify(updatedItems));
      console.log("Saved item:", newItem);
    } catch (error) {
      console.error("Failed to save user-defined item:", error);
    }
  };


  
  


  
  

