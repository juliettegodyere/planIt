import React, { useState } from "react";
import { View, FlatList, StyleSheet, ScrollView, Pressable } from "react-native";
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
import { VStack } from "./ui/vstack";
import { useShoppingActions } from "@/db/Transactions";

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
    <VStack>
    <Input size="sm" variant="outline">
      <InputField
        placeholder="Enter New Item..."
        value={customItem}
        onChangeText={setCustomItem}
        className="bg-white rounded-md"
      />
    </Input>
    <HStack space="md" className="justify-between items-center pt-2">
      <Pressable >
        <Text className=" font-medium" style={{ color: "#FF6347" }}>
          Cancel
        </Text>
      </Pressable>
      <Pressable onPress={() => handleAddCustomItem(customItem, "uncategorized")}>
        <Text className="font-extrabold" style={{ color: "#FF6347" }}>
          Add
        </Text>
      </Pressable>
    </HStack>
  </VStack>
  );
};
export default AddCustomItem;

const styles = StyleSheet.create({});
