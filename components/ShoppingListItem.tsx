import { Text, View, FlatList } from "react-native";

type ShoppingItem = {
    label: string;
    value: string;
  };
  
  type Category = {
    label: string;
    value: string;
    items: ShoppingItem[];
  };
  
  type Props = {
    shoppingList: Category;
  };
  

export default function ShoppingListItem({ shoppingList }: Props) {
    return (
      <View style={{ padding: 10 }}>
        <Text>{shoppingList.label}</Text>
      </View>
    );
  }