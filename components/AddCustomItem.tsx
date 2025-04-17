import React,{useState} from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/stateManager";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { theme } from "../assets/colors";
import {
    saveUserDefinedItem,
  } from "../service/HelperFunction";

interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
  isBought: boolean;
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

const AddCustomItem = () => {
  const { state, dispatch } = useShoppingListContext();
  const [customItem, setCustomItem] = useState("");

  const handleAddCustomItem = async (itemLabel: string) => {
    if (!itemLabel.trim()) return; // Prevent empty inputs

    await saveUserDefinedItem(itemLabel);
    setCustomItem(""); // Clear input field
  };

  return (
    <HStack
    space="sm"
    className="m-2"
    style={{
      alignItems: "center",
    }}
  >
    <Input size="xl" variant="underlined" style={{ flex: 1 }}>
      <InputField
        placeholder="Enter New Item..."
        value={customItem}
        onChangeText={setCustomItem}
      />
    </Input>
    <Button 
      onPress={() => handleAddCustomItem(customItem)} 
      style={{
        borderColor: theme.colors.buttonPrimary,
        borderWidth: 1, // Ensure border is visible
        //borderRadius:50
        //color: theme.colors.buttonSecondary
      }}
      variant="outline"
      >
        <ButtonText >Save</ButtonText>
      </Button>
  </HStack>
  );
};
export default AddCustomItem;

const styles = StyleSheet.create({});
