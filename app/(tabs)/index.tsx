import { Text, View, FlatList } from "react-native";
import shoppingListData from "../../data/shoppingListData.json"
import ShoppingListItem from "../../components/ShoppingListItem"

export default function Index() {

  return (
    <FlatList 
          data={shoppingListData.categories}
          renderItem={({ item }) => <ShoppingListItem shoppingList={item} />}
          keyExtractor={(item) => item.value}
        />
  );
}
