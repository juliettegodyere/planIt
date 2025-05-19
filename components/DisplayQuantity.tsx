import { View, FlatList, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useShoppingListContext } from "../service/store";
import {
  updateItem,
  updateQuantity,
  updateUnit,
} from "../service/stateActions";
import { ChevronDownIcon } from "@/components/ui/icon";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Divider } from "@/components/ui/divider";
import { ShoppingItem, ShoppingListItem } from "../service/state";
import { Dispatch, useContext, useEffect, useState } from "react";
import { ShoppingListAction } from "../service/store";
import { useShoppingActions } from "@/db/context/useShoppingList";
import { useQuantityDebouncer } from "@/Util/HelperFunction";

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
  const [qtyVal, SetQtyVal] = useState([0]);
  const { shoppingItems } = state;
  const { updateShoppingItemFields } = useShoppingActions();
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

    const newQuantity = [...selectedItem.quantity.slice(0, -1), newQty];

    SetQtyVal(newQuantity);
    updateShoppingItemFields(
      selectedItem.id,
      { quantity: newQuantity },
      updateItem
    );
  };
  const handleUnitSelect = async (id: string, unit: string) => {
    // dispatch(updateUnit(id, unit)); // Dispatch action
    await updateShoppingItemFields(
      selectedItem.id,
      { qtyUnit: [unit] },
      updateItem
    );
  };

  return (
    <HStack space="sm" className="px-6">
      <HStack space="xs" style={{ alignItems: "center" }} className="pr-8">
        <Box
          className="w-16 h-8 border-2 border-gray-200 rounded-md"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <HStack space="xs" style={{ alignItems: "center" }} >
            <Button
              size="xs"
              className="px-3 bg-gray-100 border-2 border-gray-200"
              onPress={() => handleUpdateQuantity(item.value, -1)}
            >
              <Text className="font-medium text-lg">-</Text>
            </Button>
            <Text className="font-medium text-md px-2">
              {isSelected === false ? 1 : qtyVal[qtyVal.length - 1] ?? 1}
            </Text>
            <Button
              size="xs"
              className="px-3 bg-gray-100 border-2 border-gray-200"
              onPress={() => handleUpdateQuantity(item.value, 1)}
            >
              <Text className="font-medium text-md">+</Text>
            </Button>
          </HStack>
        </Box>

      </HStack>
      <Divider orientation="vertical" className=" bg-gray-200"/>
      <Box className="pl-2">
      <Select
        onValueChange={(value) => handleUnitSelect(item.value, value)}
        style={{ minWidth: 120}} // Ensures it doesn't shrink too small
    >
        <SelectTrigger
        size="sm"
        variant="underlined"
        className="border-2 border-gray-200 px-8 rounded-md"
        >
        <SelectInput
            placeholder="Unit"
            className="text-lg color-slate-950"
        />
        <SelectIcon as={ChevronDownIcon} size="xl"  style={{marginTop:5, marginLeft:5}} className="color-slate-950"/>
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
      </Box>
    </HStack>
  );
};
export default DisplayQuantity;

const styles = StyleSheet.create({});
