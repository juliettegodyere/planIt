import React, { useState } from "react";
import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/stateManager";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { theme } from "../assets/colors";
import { saveUserDefinedItem } from "../service/HelperFunction";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { categoryLists } from "../data/dataStore";
import { ShoppingItem, ShoppingListItem } from "../service/state";
import {useShoppingActions} from '../db/context/useShoppingList'

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
  isBought: boolean;
};

type AddCustomItemProps = {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  fetchItems: () => void;
};

const AddCustomItem: React.FC<AddCustomItemProps> = ({
  showModal,
  setShowModal,
  fetchItems
}) => {
  // const { state, dispatch } = useShoppingListContext();
  const [customItem, setCustomItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const {addUserDefinedItem } = useShoppingActions();

  const handleAddCustomItem = async (itemLabel: string, category: string) => {
   
    if (!itemLabel.trim()) return; 
    await addUserDefinedItem(itemLabel, category);
    fetchItems();

    setCustomItem(""); 
  };
  
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0.5">
          <Heading>Add a New Item</Heading>
          {/* <Text size="sm">No worries, if the item you want is not in the list. Just add it.</Text> */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space="sm" className="px-2">
              {categoryLists.map((cat, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  onPress={() => setSelectedCategory(cat.label)}
                  className={`mt-2 ${
                    selectedCategory === cat.label
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                >
                  <ButtonText
                    className={`font-medium ${
                      selectedCategory === cat.label
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {cat.label}
                  </ButtonText>
                </Button>
              ))}
            </HStack>
          </ScrollView>
        </ModalHeader>
        <ModalBody className="mb-4">
          <Input>
            <InputField
              placeholder="Enter New Item..."
              value={customItem}
              onChangeText={setCustomItem}
            />
          </Input>
        </ModalBody>
        <ModalFooter className="flex-col items-start">
          <Button
            onPress={() => handleAddCustomItem(customItem, selectedCategory)}
            className="w-full"
          >
            <ButtonText>Add</ButtonText>
          </Button>
          <Button
            variant="link"
            size="sm"
            onPress={() => {
              setShowModal(false);
            }}
            className="gap-1"
          >
            <ButtonIcon as={ArrowLeftIcon} />
            <ButtonText>Exit</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AddCustomItem;

const styles = StyleSheet.create({});
