import {StyleSheet } from "react-native";
import { updateItem} from "../service/stateActions";
import { Button, ButtonText } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import {useShoppingActions} from "../db/Transactions"


type Props = {
  item: CategoryItemResponseType;
  selectedItemPurchaseFalse: any;
  shoppingItems:ShoppingItemTypes[];
  handleCheckboxChange?: (item: CategoryItemResponseType) => Promise<void>;
};


const PurchaseButton = ({ item, selectedItemPurchaseFalse, shoppingItems, handleCheckboxChange}: Props) => {
  const [selectedItem, setSelectedItem] = useState<ShoppingItemTypes | undefined>();
  const{updateShoppingItemAndUpdateState} = useShoppingActions()

  const isBought = selectedItem?.purchased ?? false;

  useEffect(() => {
    const s_item = shoppingItems.find(i => 
      i.key === item.value &&
      i.selected=== false &&
      i.purchased === true
    );
    setSelectedItem(s_item);
    if(isBought){
      handleCheckboxChange?.(item);
    }
  }, [shoppingItems, item]);

  const handleMarkAsPurchased = async () => {
    if (!selectedItem) return;
  
    const updatedItem: ShoppingItemTypes = {
      ...selectedItem,
      purchased: true,
      selected: false, 
      modifiedDate: new Date().toISOString(),
    };
  
    await updateShoppingItemAndUpdateState(updatedItem);
  };

console.log("PurchaseButton - shoppingItems")
console.log(shoppingItems)
  return (
    <Button
      className="border-2 border-gray-200 rounded-md"
      variant="outline"
      onPress={() => handleMarkAsPurchased()}
    >
      <ButtonText
        className="font-medium text-md px-2"
      >
        {isBought? "Undo" : "Bought"}
      </ButtonText>
    </Button>
  );
};
export default PurchaseButton;

const styles = StyleSheet.create({});
