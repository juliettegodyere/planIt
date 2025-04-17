import { View, FlatList, StyleSheet } from "react-native";
import shoppingListData from "../../data/shoppingListData.json"
import ShoppingListItem from "../../components/ShoppingListItem"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import AddCustomItem from "../../components/AddCustomItem";

interface ShoppingItem {
  label: string;
  value: string;
  category: string;
}

export default function Index() {
  const flattenedItems: ShoppingItem[] = shoppingListData.categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,       // Spread the original item (label, value)
      category: category.label,  // Add the category label
    }))
  );

  return (
    <>
     <AddCustomItem/>
    <FlatList 
          data={flattenedItems}
          renderItem={({ item }) => <ShoppingListItem shoppingList={item} />}
          keyExtractor={(item) => item.value}
        /></>
  );
}

const styles = StyleSheet.create({
  
});
