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
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useShoppingActions } from "../db/context/useShoppingList";
import { ShoppingListItem, ShoppingItem } from "../service/state";
import { useLoadShoppingItems } from "@/Util/HelperFunction";
import ShoppingItemDetails from "./ShoppingItemDetails";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

type Props = {
  shoppingList: ShoppingListItem;
};

export default function ShoppingListItemPage({ shoppingList }: Props) {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems, loading } = useLoadShoppingItems();
  const { addNewItemToDB, updateExistingItemInDB, updateShoppingItemFields } =
    useShoppingActions();
  const [showModal, setShowModal] = React.useState(false);

  //console.log(shoppingItems)
  // useEffect(() => {
  //   console.log("shoppingItems updated", shoppingItems);
  // }, [shoppingItems]);

  if (loading) return <Text>Loading...</Text>;

  const isChecked = (key: string) => {
    if (!shoppingItems || shoppingItems.length === 0) return false;
    // console.log("The ischecked shoppiing items")
    // console.log(shoppingItems)
    // console.log(_item.value + " " + "Key")
    // console.log(_item.value)
    const item = shoppingItems.find((item: ShoppingItem) => item.key === key);
    // console.log("From the ischecked function")
    // console.log(item)
    return item
      ? item.selected[item.selected.length - 1] &&
          !item.purchased[item.purchased.length - 1]
      : false;
  };

  const handleCheckboxChange = async (item: ShoppingListItem) => {
    const now = new Date().toISOString();
    const existingItem = shoppingItems.find(
      (existingItem: ShoppingItem) => existingItem.key === item.value
    );

    if (existingItem) {
      const lastPurchaseStatus =
        existingItem.purchased?.[existingItem.purchased.length - 1] ?? false;
      const lastSelectedStatus =
        existingItem.selected?.[existingItem.selected.length - 1] ?? false;

      if (!lastSelectedStatus) {
        if (lastPurchaseStatus) {
          const newEntry = {
            id: existingItem.id,
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
            isSelectedShoppingItemsHydrated: true,
          };
          // update DB and state
          await updateExistingItemInDB(newEntry);
        } else {
          //dispatch(updateSelected(existingItem.id));
          await updateShoppingItemFields(
            existingItem.id,
            { selected: [true] },
            updateItem
          );
        }
      } else {
        //dispatch(updatePurchase(existingItem.key));
        //dispatch(updateSelected(existingItem.key));
        await updateShoppingItemFields(
          existingItem.id,
          { selected: [true] },
          updateItem
        );
      }
    } else {
      const newItem = {
        id: "",
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
        isSelectedShoppingItemsHydrated: true,
      };
      //Creates Item in DB and state
      await addNewItemToDB(newItem);
    }
  };

  const selectedItem = shoppingItems.find(
    (i: ShoppingItem) =>
      i.key === shoppingList.value &&
      (i.selected[i.selected.length - 1] &&
        !i.purchased[i.purchased.length - 1]) === true
  );
  const isBought =
    selectedItem?.purchased?.[selectedItem.purchased.length - 1] || false;
  const isSelected =
    selectedItem?.selected?.[selectedItem.selected.length - 1] || false;

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
                ? "#1c1616"
                : "transparent",
              borderColor: isChecked(shoppingList.value) ? "#000" : "#000",
              borderWidth: 1,
              borderRadius: 9999, // makes it fully rounded
              width: 15,
              height: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckboxIcon
              color="#fff"
              as={CheckIcon}
              size="sm"
              style={{ borderWidth: 2 }}
            />
          </CheckboxIndicator>
          <CheckboxLabel
            // style={{
            //   fontFamily: theme.fonts.bold,
            //   fontSize: theme.sizes.medium,
            //   color: theme.colors.fontPrimary,
            //   marginLeft: 10,
            // }}
            className="text-lg ml-1 text-gray-900"
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
      <Modal
          //isOpen={showModal}
          isOpen={!!selectedItem} 
          onClose={() => {
            setShowModal(false);
          }}
          size="md"
        >
          <ModalBackdrop />
          <ModalContent className="h-[100%] w-[100%] bg-gray-200">
            <ModalHeader className="mt-10">
            <ModalCloseButton>
                <Icon
                  as={CloseIcon}
                  size="md"
                  className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
                />
              </ModalCloseButton>
              <Heading size="md" className="text-typography-950">
                {/* Invite your team */}
              </Heading>
            </ModalHeader>
            <ModalBody className="mt-10">
              <Text size="sm" className="text-typography-500">
                Elevate user interactions with our versatile modals. Seamlessly
                integrate notifications, forms, and media displays. Make an
                impact effortlessly.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                action="secondary"
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <ButtonText>Explore</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({});

//TODO
// Work on when am item is bought what is expected
//Work on adding new entry
// Troobleshoot while if the number of entry for a given item is greater than 1. When you click on uncheck, it removes it from the item individual list and live selected for the formal item as true.
