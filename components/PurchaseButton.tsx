import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/stateManager";
import { updatePurchase } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { theme } from "../assets/colors";

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

const PurchaseButton = ({ item, selectedItem, isBought }: Props) => {
  const { state, dispatch } = useShoppingListContext();

  const handleMarkAsPurchased = (id: string) => {
    dispatch(updatePurchase(id));
    //dispatch(updateSelected(id));
  };

  return (
    <Button
      //color={isBought ? "red" : "green"} //
      style={{
        borderColor: isBought ? "#E82B35" : theme.colors.buttonPrimary,
        borderWidth: 1, // Ensure border is visible
        borderRadius:50
        //color: theme.colors.buttonSecondary
      }}
      variant="outline"
      onPress={() => handleMarkAsPurchased(item.value)}
    >
      <ButtonText
        //className={isBought ? "bg-red-500" : "bg-green-700"}
        className="text-typography-400 font-medium"
        style={{ color: theme.colors.fontPrimary }}
      >
        {isBought ? "Undo" : "Bought"}
      </ButtonText>
    </Button>
  );
};
export default PurchaseButton;

const styles = StyleSheet.create({});
