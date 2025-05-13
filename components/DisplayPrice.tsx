import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/store";
import { updateItem, updatePrice } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";
import {ShoppingItem} from "../service/state"
import { useEffect, useState } from "react";
import { useShoppingActions } from "@/db/context/useShoppingList";


interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
};

const DisplayPrice = ({ item, selectedItem }: Props) => {
  const [priceInput, setPriceInput] = useState("");
  const { state, dispatch } = useShoppingListContext();
  const {guest} = state
  const {updateShoppingItemFields } = useShoppingActions()

  useEffect(() => {
    const lastPrice = selectedItem?.price?.[selectedItem.price.length - 1];
    if (lastPrice) {
      setPriceInput(lastPrice); 
    }
  }, [selectedItem]);

  const handleUpdatePrice = async (id: string, newPrice: string) => {
    //dispatch(updatePrice(id, newPrice)); 
    await updateShoppingItemFields(selectedItem.id, { price: [newPrice]}, updateItem);
  };
  
  const handleChange = (text: string) => {
    setPriceInput(text);
    handleUpdatePrice(item.value, text); 
  };

  return (
    <HStack
      space="sm"
      style={{
        alignItems: "center",
      }}
    >
      <Text className="text-typography-400 font-bold text-xl">Price: {guest.currency}</Text>
      <Input size="xl" variant="underlined" style={{ flex: 1 }}>
        <InputField
          placeholder="Enter Price here..."
          value={priceInput}
          onChangeText={handleChange}
        />
      </Input>
    </HStack>
  );
};
export default DisplayPrice;

const styles = StyleSheet.create({});


