import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { useShoppingListContext } from "../service/store";
import { theme } from "../assets/colors";
import {
  updateItem,
  updatePurchase,
  updateSelected,
} from "../service/stateActions";
import DisplayQuantity from "../components/DisplayQuantity";
import DisplayPrice from "../components/DisplayPrice";
import DisplayPriority from "../components/DisplayPriority";
import { HStack } from "./ui/hstack";
import PurchaseButton from "./PurchaseButton";
import { Icon, CheckIcon } from "@/components/ui/icon";
import {useShoppingActions} from "../db/context/useShoppingList"
import {ShoppingListItem, ShoppingItem} from "../service/state"
import { useLoadShoppingItems } from "@/Util/HelperFunction";

type Props = {
  shoppingList: ShoppingListItem;
};

export default function ShoppingListItemPage({ shoppingList }: Props) {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems, loading } = useLoadShoppingItems();
  const { addNewItemToDB, updateExistingItemInDB, updateShoppingItemFields } = useShoppingActions()
  //console.log(shoppingItems)
  // useEffect(() => {
  //   console.log("shoppingItems updated", shoppingItems);
  // }, [shoppingItems]);
  
  if (loading) return <Text>Loading...</Text>;

  const isChecked = (key:string) => {
    if (!shoppingItems || shoppingItems.length === 0) return false;
    // console.log("The ischecked shoppiing items")
    // console.log(shoppingItems)
    // console.log(_item.value + " " + "Key")
    // console.log(_item.value)
    const item = shoppingItems.find((item: ShoppingItem) => item.key === key);
    // console.log("From the ischecked function")
    // console.log(item)
    return item ? (item.selected[item.selected.length - 1] && !item.purchased[item.purchased.length - 1] ) : false;
  };

  const handleCheckboxChange = async (item: ShoppingListItem) => {
    console.log("Function")
    const now = new Date().toISOString();
    console.log(item)
    console.log("From the handle checkboxchange function")
    console.log(shoppingItems)
    console.log(state.shoppingItems)
    const existingItem = shoppingItems.find(
      (existingItem: ShoppingItem) => existingItem.key === item.value
    );
    console.log(existingItem)

    if (existingItem) {
      const lastPurchaseStatus =
        existingItem.purchased?.[existingItem.purchased.length - 1] ?? false;
      const lastSelectedStatus =
        existingItem.selected?.[existingItem.selected.length - 1] ?? false;
    console.log("Last purchased" +lastPurchaseStatus)
    console.log("Last seleted" + lastSelectedStatus)

        if(!lastSelectedStatus) {
          if (lastPurchaseStatus) {
            const newEntry = {
              id:existingItem.id,
              key: item.value,
              name: item.label,
              category: item.category,
              modifiedDate: [now],
              createDate: [now],
              price: [""],
              purchased: [false],
              selected: [true],
              qtyUnit: ["None"],
              quantity: [1],
              priority: ["Low"],
            };
            console.log("I am not selected but already purcahsed in the past");
            // update DB and state
            await updateExistingItemInDB(newEntry);
          } else {
            //dispatch(updateSelected(existingItem.id));
            console.log("I am not selected and not bought");
            console.log(existingItem)
            await updateShoppingItemFields(existingItem.id, { selected: [true] }, updateItem);
          }
        }else{
          console.log("I am selected but not bought");
            console.log(existingItem)
            //dispatch(updatePurchase(existingItem.key));
            //dispatch(updateSelected(existingItem.key));
            await updateShoppingItemFields(existingItem.id, { selected: [true] }, updateItem);
        }
    } else {
      const newItem = {
        id:"",
        key: item.value,
        name: item.label,
        category: item.category,
        modifiedDate: [now],
        createDate: [now],
        price: [""],
        purchased: [false],
        selected: [true],
        qtyUnit: ["None"],
        quantity: [1],
        priority: ["Low"],
      };
      //Creates Item in DB and state
      await addNewItemToDB(newItem);
    }
  };

  const selectedItem = shoppingItems.find(
    (i: ShoppingItem) =>
      i.key === shoppingList.value && (i.selected[i.selected.length - 1] && !i.purchased[i.purchased.length - 1]) === true
  );
  const isBought =
    selectedItem?.purchased?.[selectedItem.purchased.length - 1] || false;
  const isSelected =
    selectedItem?.selected?.[selectedItem.selected.length - 1] || false;
  // console.log("from the shopping List Item function")
  // console.log(state.shoppingItems[0])
  // console.log(shoppingItems)
  return (
    <Card size="md" variant="elevated" className="m-2">
      <HStack
        space="4xl"
        style={{
          alignItems: "center",
          justifyContent: "space-between", 
          width: "100%", 
        }}
      >
        <Checkbox
          value={shoppingList.value}
          size="lg"
          isChecked={isChecked(shoppingList.value)}
          onChange={() => handleCheckboxChange(shoppingList)}
        >
          <CheckboxIndicator
            style={{
              backgroundColor: isChecked(shoppingList.value)
                ? "#ccc" 
                : 'transparent',
              borderColor: isChecked(shoppingList.value)
                ? "#fff"  
                : '', 
              borderWidth: 2,
            }}
          >
            <CheckboxIcon
              color={theme.colors.fontSecondary}
              as={CheckIcon}
              size="lg"
              style={{borderWidth: 2}}
            />
          </CheckboxIndicator>
          <CheckboxLabel
            style={{
              //textDecorationLine: isBought ? "line-through" : "none",
              fontFamily: theme.fonts.bold,
              fontSize: theme.sizes.medium,
              color: theme.colors.fontPrimary,
            }}
          >
            {shoppingList.label}
          </CheckboxLabel>
        </Checkbox>
        {selectedItem && (
            <PurchaseButton
            item={shoppingList}
            isBought={isBought}
            selectedItem={selectedItem}
            
            />
        )}
      </HStack>
      {selectedItem && (
        <VStack>
          <Box className="mt-3">
            <DisplayQuantity
              item={shoppingList}
              isSelected={isSelected}
              selectedItem={selectedItem}
            />
          </Box>
          <Box>
            <DisplayPrice item={shoppingList} selectedItem={selectedItem} />
          </Box>
          <Box>
            <DisplayPriority item={shoppingList} selectedItem={selectedItem} />
          </Box>
        </VStack>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({});

//TODO
// Work on when am item is bought what is expected
//Work on adding new entry
// Troobleshoot while if the number of entry for a given item is greater than 1. When you click on uncheck, it removes it from the item individual list and live selected for the formal item as true.
