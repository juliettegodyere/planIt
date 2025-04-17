import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/stateManager";
import { updatePrice } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";

interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
};

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number[];
  qtyUnit: string[];
  price: string[];
  purchased: boolean[];
  selected: boolean[]; // ✅ Ensure selected is an array
  createDate: string[];
  modifiedDate: string[];
  priority: string[];
  category: string;
}

const DisplayPrice = ({ item, selectedItem }: Props) => {
  const { state, dispatch } = useShoppingListContext();

  const handleUpdatePrice = (id: string, newPrice: string) => {
    dispatch(updatePrice(id, newPrice)); // Dispatch action
  };

  return (
    <HStack
      space="sm"
      style={{
        alignItems: "center",
      }}
    >
      <Text className="text-typography-400 font-bold text-lg">Price: </Text>
      <Input size="xl" variant="underlined" style={{ flex: 1 }}>
        <InputField
          placeholder="Enter Price here..."
          value={selectedItem?.price?.[selectedItem.price.length - 1] || ""}
          onChangeText={(text) => handleUpdatePrice(item.value, text)}
        />
      </Input>
    </HStack>
  );
};
export default DisplayPrice;

const styles = StyleSheet.create({});
