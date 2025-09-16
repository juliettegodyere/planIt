import React, { Dispatch, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { checkboxControlActions } from "@/hooks/checkboxControlActions";

import { useShoppingListContext } from "@/service/store";
import {
  CategoryItemResponseType,
  ReminderItemType,
  ShoppingItemTypes,
} from "@/service/types";
import { useShoppingActions } from "@/db/Transactions";
import { useSQLiteContext } from "expo-sqlite";
import { useToast } from "@/components/ui/toast";
import ShoppingListCheckboxRow from "./ShoppingListCheckboxRow";
import ItemInformationSheetController, {
  ItemInformationSheetHandle,
} from "./ItemInformationSheetController";
import { getCategoryByValue, getReminderByItemId } from "@/db/EntityManager";
import { ShoppingListStateTypes } from "@/service/state";
import { addItem, removeItem, setSelectedShoppingItemsHydrated, updateItem } from "@/service/stateActions";
import { Card } from "./ui/card";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { Button, ButtonText } from "./ui/button";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { DEFAULTS } from "@/Util/constants/defaults";
import { showToast } from "@/Util/toastUtils";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import QuantitySelector from "./QuantitySelector";
import { handleDeleteItem, handleUpdateQuantity } from "@/Util/HelperFunction";
import { useShoppingItemActions } from "@/hooks/useShoppingItemActions";


type Props = {
  shoppingList: CategoryItemResponseType;
  globalItem?: ShoppingListStateTypes;
  dispatch: Dispatch<any>,
  updateShoppingItemAndReturn: (entry: ShoppingItemTypes) => Promise<ShoppingItemTypes | undefined>,
  shoppingItemLists: ShoppingListStateTypes[],
  deleteShoppingItemAndReturn: (id: string) => Promise<ShoppingListStateTypes | undefined>
};

export default function ShoppingListItemComponent({ shoppingList, globalItem, dispatch, updateShoppingItemAndReturn, shoppingItemLists, deleteShoppingItemAndReturn }: Props) {
  const db = useSQLiteContext();
  const { createOrToggleShoppingItem, isCreating } = useShoppingItemActions(db);

  return (
    <Card size="md" variant="elevated" className="m-1">
    <VStack>
      <Text
        size="xl"
        className="font-bold"
        style={{ color: "#333333" }}
      >
        {shoppingList.label}
      </Text>
      {globalItem === undefined ||
      Number(globalItem?.quantity) === 0 ? (
        <Button
          variant="solid"
          size="md"
          className="rounded-full mt-4"
          style={{ backgroundColor: "#FF6347", width: "40%" }}
          onPress={() => createOrToggleShoppingItem(shoppingList)}
        >
          <ButtonText>
            Add to basket
          </ButtonText>
        </Button>
      ) : (
        <VStack >
          <QuantitySelector
          quantity={globalItem.quantity}
          onIncrease={() =>
            handleUpdateQuantity(
              1,
              globalItem,
              dispatch,
              updateShoppingItemAndReturn
            )
          }
          onDecrease={() =>
            handleUpdateQuantity(
              -1,
              globalItem,
              dispatch,
              updateShoppingItemAndReturn
            )
          }
          onDelete={() =>
            handleDeleteItem(
              globalItem.id,
              shoppingList,
              shoppingItemLists,
              dispatch,
              deleteShoppingItemAndReturn
            )
          }
          //borderColor="#FF6347"
          // width="50%" // override if needed
        />
        </VStack>
      )}
    </VStack>
  </Card>
  );
}

const styles = StyleSheet.create({});
