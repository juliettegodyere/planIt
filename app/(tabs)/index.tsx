import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import ShoppingListItemPage from "../../components/ShoppingListItem";
import { Box } from "@/components/ui/box";
import AddCustomItem from "../../components/AddCustomItem";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon, Icon, ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { getAllShoppingItems } from "../../db/queries";
import { CategoryItemResponseType } from "../../db/types";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";
import { categoryOptions } from "@/data/dataStore";
import { Spinner } from "@/components/ui/spinner";
import { setInventoryItems, addItem } from "@/service/stateActions";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { BookImage, PlusIcon } from "lucide-react-native";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useShoppingActions } from "@/db/context/useShoppingList";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import Fuse from "fuse.js";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox"
import { CheckIcon } from "@/components/ui/icon"
import { useShoppingItemActions } from "@/hooks/useShoppingItemActions";

export default function Index() {
  const { state, dispatch } = useShoppingListContext();
  const { inventoryItems } = state;
  const [showModal, setShowModal] = React.useState(false);
  const [inventoryItem, setInventoryItem] = useState<
    CategoryItemResponseType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const [selectedCat, setSelectedCat] = useState("All");
  const [isCreateButtonPressed, setCreateButtonPressed] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const { addUserDefinedItem } = useShoppingActions();
  const [similarItems, setSimilarItems] = useState<CategoryItemResponseType[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSimilarItems, setSelectedSimilarItems] = useState<string[]>([]);
  const { isChecked, handleCheckboxChange } = useShoppingItemActions();


  const fetchItems = async () => {
    const data = await getAllShoppingItems(db);

    const selectedKeys = state.shoppingItems
      .filter((item) => item.selected[item.selected.length - 1])
      .map((item) => item.key);

    const sorted = [...data].sort((a, b) => {
      const aIsSelected = selectedKeys.includes(a.value);
      const bIsSelected = selectedKeys.includes(b.value);

      if (aIsSelected && !bIsSelected) return -1;
      if (!aIsSelected && bIsSelected) return 1;

      return a.label.localeCompare(b.label);
    });

    const filtered =
      selectedCat === "All"
        ? sorted
        : sorted.filter((item) => item.category === selectedCat);

    dispatch(setInventoryItems(filtered));

    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCat, state.shoppingItems]);

  if (loading) {
    <HStack space="sm">
      <Spinner />
      <Text size="md">Please Wait</Text>
    </HStack>;
  }

  const toggleSelect = (label: string) => {
    setSelectedCat(label);
  };

  const onPressCreateItemFunction = () => {
    setCreateButtonPressed(true);
    console.log("onPressCreateItemFunction Clicked");
    console.log(isCreateButtonPressed);
  };

  const onPressCancelFunction = () => {
    setCreateButtonPressed(false);
    console.log("onPressCancelFunction Clicked");
    console.log(isCreateButtonPressed);
  };
  const onPressAddFunction = () => {
    setCreateButtonPressed(false);
    console.log("onPressAddFunction Clicked");
    console.log(isCreateButtonPressed);
  };

  const handleAddCustomItem = async (itemLabel: string, category: string) => {
    if (!itemLabel.trim()) return;

    const data = await getAllShoppingItems(db); // returns static + db items

    const fuse = new Fuse(data, {
      keys: ["label", "value"],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
    });

    const fuseResults = fuse.search(itemLabel).map((result) => result.item);

    if (fuseResults.length > 0) {
      setSimilarItems(fuseResults);
      setShowSuggestions(true);
      return; // Don’t insert yet
    }

    await addUserDefinedItem(itemLabel, category);
    fetchItems();
    setCustomItem("");
  };

  const handleAddUserDefinedItemEvenIfItExist = async () => {
    const entered = customItem.trim().toLowerCase();
    if (!entered) return;
  
    const similarTextMatch = similarItems.find((item) => {
      const existing = item.label.toLowerCase();
  
      // Match: entered and existing are the same (e.g., "banana" vs "bananas")
      const pluralRegex = new RegExp(`^${entered}s?$`, 'i');
      const reverseRegex = new RegExp(`^${existing}s?$`, 'i');
  
      return pluralRegex.test(existing) || reverseRegex.test(entered);
    });
  
    if (
      similarTextMatch &&
      similarTextMatch.category.toLowerCase() === "uncategorized"
    ) {
      Alert.alert(
        "Item Exists",
        `A similar item "${similarTextMatch.label}" already exists in this category. Please select the existing one.`
      );
      return;
    }
  
    await addUserDefinedItem(customItem, "Uncategorized");
    fetchItems();
    setCustomItem("");
    setShowSuggestions(false);
    setSimilarItems([]);
    setSelectedSimilarItems([]);
  };  

  const hasSelectedSimilarItems = () => {
    return similarItems.some((item) => isChecked(item.value));
  };

  return (
    <>
    <KeyboardAvoidingView
      style={{
        flex: 1,
        position: "relative",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box style={{ flex: 1, position: "relative" }}>
          {/* Background Image */}
          <Box
            style={{
              ...StyleSheet.absoluteFillObject, // fills the parent
              zIndex: 0,
            }}
          >
            <Image
              size="full"
              // source={{
              //   uri: "https://gluestack.github.io/public-blog-video-assets/mountains.png",
              // }}
              source={require("../../assets/images/background.png")}
              alt="background"
              style={{ flex: 1 }}
            />
          </Box>

          {/* Foreground Content */}
          <Box
            style={{
              flex: 1,
              zIndex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                height: "85%",
                width: "85%",
                //padding: 16,
                position: "relative",
                marginTop: -80,
                backgroundColor: "#F1F1F1",
              }}
              className="rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <Box
                style={{
                  height: "7%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 10,
                  backgroundColor: "#F1F1F1",
                }}
                className="p-3"
              >
                <HStack space="md" className="justify-between">
                  <Heading className="text-gray-900 font-normal">
                    Shopping list
                  </Heading>
                  <Icon as={ThreeDotsIcon} className="text-gray-900" />
                </HStack>
              </Box>

              {/* Footer */}
              <Box
                style={{
                  height: isCreateButtonPressed ? "auto" : "7%",
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  zIndex: 10,
                  backgroundColor: "#F1F1F1",
                }}
                className="p-3"
              >
                {!isCreateButtonPressed ? (
                  <HStack space="md" className="justify-between items-center">
                    <HStack space="sm">
                      <Icon as={AddIcon} className="text-typography-800" />
                      <Pressable onPress={onPressCreateItemFunction}>
                        <Text>Add Item</Text>
                      </Pressable>
                    </HStack>
                    <BookImage size={15} color="#888" />
                  </HStack>
                ) : (
                  <VStack>
                    <Input size="md" variant="outline" className=" bg-white">
                      <InputField
                        placeholder="Enter New Item..."
                        value={customItem}
                        onChangeText={setCustomItem}
                        className="bg-white rounded-md"
                      />
                      <InputSlot className="pr-3 bg-white">
                        <AntDesignIcon
                          size={15}
                          name="arrowsalt"
                          color="#888"
                          onPress={() => setShowModal(true)}
                        />
                      </InputSlot>
                    </Input>
                    <HStack
                      space="md"
                      className="justify-between items-center pt-2"
                    >
                      <Pressable onPress={onPressCancelFunction}>
                        <Text
                          className=" font-medium"
                          style={{ color: "#FF6347" }}
                        >
                          Cancel
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          handleAddCustomItem(customItem, "Uncategorized")
                        }
                      >
                        <Text
                          className="font-extrabold"
                          style={{ color: "#FF6347" }}
                        >
                          Add
                        </Text>
                      </Pressable>
                    </HStack>
                  </VStack>
                )}
              </Box>

              {/* Scrollable Content */}
              <FlatList
                contentContainerStyle={{
                  padding: 5,
                  // paddingTop: "10%",
                  // paddingBottom: "10%",
                  paddingTop: isCreateButtonPressed ? "16%" : "10%",
                  paddingBottom: isCreateButtonPressed ? "16%" : "10%",
                }}
                data={inventoryItems}
                renderItem={({ item }) => (
                  <ShoppingListItemPage
                    shoppingList={item}
                    isModalOpen={showModal}
                    onCloseModal={() => setShowModal(false)}
                  />
                )}
                keyExtractor={(item) => item.value}
                showsVerticalScrollIndicator={false}
              />
            </Box>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    <AlertDialog
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
      >
        <AlertDialogContent>
          {/* <AlertDialogHeader>Similar Item(s) Found</AlertDialogHeader> */}
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold mb-2" size="md">
              Similar Item(s) Found
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            {similarItems.map((item, index) => (

              <Checkbox 
                size="md" 
                key={index} 
                value={item.label} 
                // isChecked={selectedSimilarItems.includes(item.label)}
                isChecked={isChecked(item.value)}
                onChange={() => handleCheckboxChange(item)}
                // onChange={(isChecked) => {
                //   setSelectedSimilarItems((prev) =>
                //     isChecked
                //       ? [...prev, item.label]
                //       : prev.filter((label) => label !== item.label)
                //   );

                //   if (isChecked) {
                //     const now = new Date().toISOString();
                //     const newItem = {
                //       id: "",
                //       key: item.value,
                //       name: item.label,
                //       category: item.category,
                //       modifiedDate: [now],
                //       createDate: [now],
                //       price: [""],
                //       purchased: [false],
                //       selected: [true],
                //       qtyUnit: ["None"],
                //       quantity: [1],
                //       priority: ["Low"],
                //       isSelectedShoppingItemsHydrated: true,
                //     }
                //     dispatch(addItem(newItem));
                //   }else
                // }}
                
                className="m-2"
                >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>{item.label} ({item.category})</CheckboxLabel>
              </Checkbox>
            ))}
          </AlertDialogBody>
          <AlertDialogFooter>
          {hasSelectedSimilarItems() ? (
          <Pressable
            onPress={() => {
              setShowSuggestions(false);
              setSimilarItems([]);
              setSelectedSimilarItems([]);
              setCustomItem("");
            }}
          >
            <Text
              className="font-extrabold"
              style={{ color: "#FF6347" }}
            >
              Done
            </Text>
          </Pressable>
          ) : (
            <Pressable onPress={handleAddUserDefinedItemEvenIfItExist}>
              <Text className="font-extrabold" style={{ color: "#FF6347" }}>
                Add anyway
              </Text>
            </Pressable>
          )}

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const styles = StyleSheet.create({});
