import { shoppingData } from "../data/shoppingListData.json"
import AsyncStorage from '@react-native-async-storage/async-storage';


export const loadUserDefinedItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("userDefinedItems");
      if (storedItems) {
        return JSON.parse(storedItems);
      }
      return [];
    } catch (error) {
      console.error("Failed to load user-defined items:", error);
      return [];
    }
  };

export const getShoppingItems = async () => {
  const userDefinedItems = await loadUserDefinedItems();

  // Find the "Uncategorized" category
  let categories = [...shoppingData.categories];
  let uncategorized = categories.find((cat) => cat.value === "uncategorized");

  if (!uncategorized) {
    uncategorized = { label: "Uncategorized", value: "uncategorized", items: [] };
    categories.push(uncategorized);
  }

  // Merge user-defined items into "Uncategorized"
  uncategorized.items = [...uncategorized.items, ...userDefinedItems];

  return categories;
};

export const saveUserDefinedItem = async (label) => {
    try {
      const userDefinedItems = await loadUserDefinedItems();
  
      const newItem = {
        label,
        value: `item-${Date.now()}`, // Unique ID
      };
  
      const updatedItems = [...userDefinedItems, newItem];
  
      await AsyncStorage.setItem("userDefinedItems", JSON.stringify(updatedItems));
      console.log("Saved item:", newItem);
      console.log("All user-defined items:", updatedItems);
    } catch (error) {
      console.error("Failed to save user-defined item:", error);
    }
  };
  


  
  

