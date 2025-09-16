import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { MainCategoryOptions, categoryOptions } from "@/data/dataStore";
import React, { Dispatch, useEffect, useState } from "react";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Heading } from "./ui/heading";
import { Pressable, View } from "react-native";
import { updateItem } from "@/service/stateActions";
import { Input, InputField } from "./ui/input";
import { useShoppingActions } from "@/db/Transactions";
import { ShoppingListStateTypes } from "@/service/state";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: ShoppingListStateTypes|null;
  dispatch: React.Dispatch<any>,
}

const AddCategorySheet = ({ isOpen, onClose, selectedItem, dispatch}: Props) => {
  const [category, setCategory] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const {
    addUserDefinedCategory,
    getCategoryByName,
    updateShoppingItemAndReturn
  } = useShoppingActions();

  useEffect(() => {
    const fetchCategoryLabel = async () => {

      try {
          if(category){
            const cat = await getCategoryByName(category);
            if(cat){
              setCategoryId(cat?.id)
            }
          }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };

    fetchCategoryLabel();
  }, [category, selectedItem]);

  const handleCreateCategory = async (newCategoryName: string)=>{
      //console.log(newCategoryName)
      //await addUserDefinedCategory(newCategoryName);
  }

  const handleHandleShoppingItemCategory = async ()=>{
    if (!selectedItem) return;
  
    const updatedItem: ShoppingListStateTypes = {
      ...selectedItem,
      category_item_id:category_id,
      modifiedDate: new Date().toISOString(),
    };  
    const updatedItem_ = await updateShoppingItemAndReturn(updatedItem);
    if(updatedItem_){
      dispatch(updateItem(updatedItem_.id, updatedItem_));
    }
    onClose()
  }
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full py-2">
            <HStack className="justify-between">
              {/* <Icon as={CloseIcon} className="" size="xl"/> */}
              <Pressable onPress={onClose}>
              <Text className="text-red-600">Cancel</Text>
              </Pressable>
              <Heading className="ml-14">Category</Heading>
              <Button 
                className="rounded-full" 
                isDisabled={category === ""}
                onPress={handleHandleShoppingItemCategory}>
                <ButtonText>Done</ButtonText>
              </Button>
            </HStack>
            {/* <VStack style={{ alignItems: "center" }}>
              <Pressable onPress={() => setShowCreateDialog(true)}>
                <Box className="bg-black w-20 h-20 justify-center items-center rounded-full border-2 border-red-500">
                  <Icon as={AddIcon} size="xl" className="text-white" />
                </Box>
              </Pressable>
              <Text>Create</Text>
            </VStack> */}
            <Heading className="my-4">Default Category</Heading>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {MainCategoryOptions.map((cat, index) => {
                const IconComponent = cat.IconPack;
                const isSelected = category === cat.label; // <-- check if selected

                return (
                  <Pressable
                    key={index}
                    onPress={() => setCategory(cat.label)}
                    style={{
                      width: 70,
                      alignItems: "center",
                      margin: 8,
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: isSelected ? "#e0f0ff" : "#fff", // highlight when selected
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? "#3498db" : "#ccc", // primary border for selected
                    }}
                  >
                    <VStack style={{ alignItems: "center" }} space="sm">
                      {IconComponent && (
                        <IconComponent
                          name={cat.IconName}
                          size={28}
                          color={cat.color}
                        />
                      )}
                      <Text size="sm" className="text-center">
                        {cat.label}
                      </Text>
                    </VStack>
                  </Pressable>
                );
              })}
            </View>
            {/* <Button
              size="md"
              variant="solid"
              action="primary"
              onPress={() => handleClose(category)}
              isDisabled={category === ""}
            >
              <ButtonText>Done</ButtonText>
            </Button> */}
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      {/* <AlertDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent className="gap-4 items-center">
          <AlertDialogHeader>
            <Heading size="md">New Category</Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="w-full">
          <HStack
      space="sm"
      style={{
        alignItems: "center",
      }}
      className="my-5"
    >
      <Input size="lg" variant="outline" className="w-full">
        <InputField
          placeholder="Category"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          className="font-medium text-lg"
        />
      </Input>
    </HStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              action="secondary"
              onPress={() => setShowCreateDialog(false)}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                handleCreateCategory(newCategoryName);
                setShowCreateDialog(false);
                setNewCategoryName("");
              }}
              isDisabled={newCategoryName.trim() === ""}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
};

export default AddCategorySheet;
