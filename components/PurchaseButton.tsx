import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/store";
import { updateItem, updatePurchase,updateSelected } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { theme } from "../assets/colors";
import {ShoppingItem, ShoppingListItem} from "../service/state"
import { useShoppingActions } from "@/db/context/useShoppingList";


type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
  isBought: boolean;
};


const PurchaseButton = ({ item, selectedItem, isBought }: Props) => {
  const { state, dispatch } = useShoppingListContext();
  const {updateShoppingItemFields } = useShoppingActions()

  const handleMarkAsPurchased = async (id: string) => {
    //dispatch(updatePurchase(id));
    //dispatch(updateSelected(id));
    await updateShoppingItemFields(selectedItem.id, { purchased: [true], selected:[false] }, updateItem);
  };
//   console.log("from purcahse page")
// console.log(state.shoppingItems)
  return (
    <Button
      //color={isBought ? "red" : "green"} //
      style={{
        borderColor: theme.colors.buttonPrimary,
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
        {/* {isBought ? "Undo" : "Bought"} */}
        Bought
      </ButtonText>
    </Button>
  );
};
export default PurchaseButton;

const styles = StyleSheet.create({});
