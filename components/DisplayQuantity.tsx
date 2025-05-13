import { View, FlatList, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useShoppingListContext } from "../service/store";
import { updateItem, updateQuantity, updateUnit } from "../service/stateActions";
import { ChevronDownIcon } from "@/components/ui/icon";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Divider } from '@/components/ui/divider';
import {ShoppingItem, ShoppingListItem} from "../service/state"
import { Dispatch, useContext, useEffect, useState } from "react";
import { ShoppingListAction } from "../service/store"; 
import { useShoppingActions } from "@/db/context/useShoppingList";
import {useQuantityDebouncer} from "@/Util/HelperFunction"


import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
  } from "@/components/ui/select";


type Props = {
  item: ShoppingListItem;
  isSelected: boolean;
  selectedItem: ShoppingItem;
};

const DisplayQuantity = ({ item, isSelected, selectedItem }: Props) => {
  const { state, dispatch } = useShoppingListContext();
  const [qtyVal, SetQtyVal] = useState([0])
  const { shoppingItems } = state;
  const {updateShoppingItemFields } = useShoppingActions()
  const debounce = useQuantityDebouncer();

  useEffect(() => {
    if (isSelected && selectedItem?.quantity?.length > 0) {
      SetQtyVal([...selectedItem.quantity]);
    } else {
      SetQtyVal([1]);
    }
  }, [isSelected]);

  const handleUpdateQuantity = async (key: string, change: number) => {
    const lastQty = qtyVal[qtyVal.length - 1] ?? 1;
    const newQty = Math.max(1, lastQty + change);
  
    const newQuantity = [
      ...selectedItem.quantity.slice(0, -1),
      newQty
    ];
  
    SetQtyVal(newQuantity);
    updateShoppingItemFields(selectedItem.id, { quantity: newQuantity }, updateItem);
  };
  const handleUnitSelect = async (id: string, unit: string) => {
   // dispatch(updateUnit(id, unit)); // Dispatch action
   await updateShoppingItemFields(selectedItem.id, { qtyUnit: [unit]}, updateItem);
  };
    
  return (
    <HStack
        space="sm"
        style={{
            alignItems:"center",
            borderColor: "#cccccc",
            borderWidth: 1,
            borderRadius: 9999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: "#f9f9f9", // optional: to unify background
        }}
        >
    {/* Quantity Selector */}
    <HStack space="xs" style={{alignItems:"center"}}>
        <Button
        size="xs"
        className="px-3 bg-gray-300"
        onPress={() => handleUpdateQuantity(item.value, -1)}
        >
        <ButtonText className="text-typography-400 font-bold text-lg">-</ButtonText>
        </Button>

        <Text className="text-typography-400 font-bold text-lg">
          {isSelected === false
            ? 1
            : qtyVal[qtyVal.length - 1] ?? 1}
        </Text>

        <Button
        size="xs"
        className="px-3 bg-gray-300"
        onPress={() => handleUpdateQuantity(item.value, 1)}
        >
        <ButtonText className="text-typography-400 font-bold text-lg">+</ButtonText>
        </Button>
    </HStack>
    <Divider orientation="vertical" className="mx-2  bg-gray-300"/>
    {/* Unit Selector */}
    <Select
        onValueChange={(value) => handleUnitSelect(item.value, value)}
        style={{ minWidth: 120}} // Ensures it doesn't shrink too small
    >
        <SelectTrigger
        size="sm"
        variant="underlined"
        //className="border border-gray-300  px-3"
        >
        <SelectInput
            placeholder="Unit"
            className="text-typography-400 text-lg"
        />
        <SelectIcon as={ChevronDownIcon} size="xl"  style={{marginTop:8, marginLeft:5}}/>
        </SelectTrigger>

        <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
            <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {["Bag", "Packet", "Satchet", "Caton", "Box", "Bottle"].map(
            (qty, idx) => (
                <SelectItem key={idx} label={`${qty} (s)`} value={`${qty} (s)`} />
            )
            )}
        </SelectContent>
        </SelectPortal>
    </Select>
    </HStack>
  );
};
export default DisplayQuantity;

const styles = StyleSheet.create({});
