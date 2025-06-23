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
  SectionList,
} from "react-native";
import { Box } from "@/components/ui/box";
import { AddIcon, Icon, ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { CategoryItemResponseType } from "../../service/types";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";
import { Spinner } from "@/components/ui/spinner";
import { setCatalogItems} from "@/service/stateActions";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { BookImage } from "lucide-react-native";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import Fuse from "fuse.js";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
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
import { checkboxControlActions } from "@/hooks/checkboxControlActions";
import { getAllCatalogItems } from "@/db/EntityManager";
import { useShoppingActions } from "@/db/Transactions";
import ShoppingListItemComponent from "../../components/ShoppingListItemComponent";
import ThreeDotIconMenu from "@/components/ThreeDotIconMenu";

export default function Index() {
  const { state, dispatch } = useShoppingListContext();
  const { catalogItems } = state;
  const [showModal, setShowModal] = React.useState(false);
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
  const { addNewItemToShoppingItemsAndUpdateState, updateShoppingItemAndUpdateState } = useShoppingActions();
  const [sortByValue, setSortByValue] = useState<string>("Marked Items");
  const [filterByValue, setFilterByValue] = useState<string>("All");
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);
  const { isChecked, handleCheckboxChange } = checkboxControlActions(
    db,
    state,
    dispatch,
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState
  );


  const fetchItems = async () => {
    try {
      const data = await getAllCatalogItems(db);
  
      const selectedKeys = state.shoppingItemLists
        .filter((item) => item.selected)
        .map((item) => item.key);
  
      const sorted = [...data].sort((a, b) => {
        switch (sortByValue) {
          case "Marked Items": {
            const aIsSelected = selectedKeys.includes(a.value);
            const bIsSelected = selectedKeys.includes(b.value);
  
            if (aIsSelected && !bIsSelected) return -1;
            if (!aIsSelected && bIsSelected) return 1;
            return a.label.localeCompare(b.label);
          }
          case "Alphabet":
            return a.label.localeCompare(b.label);
  
          // case "Category":
          //   return a.category.localeCompare(b.category);
  
          default:
            return 0;
        }
      });
  
      const isAllCategory = filterByValue.toLowerCase() === "all";
      const filtered = isAllCategory
        ? sorted
        : sorted.filter((item) =>
        item.category.toLowerCase() === filterByValue.toLowerCase()
          );
  
      dispatch(setCatalogItems(filtered));
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };  

  const groupedCatalogItems = groupByCategory
  ? catalogItems.reduce((acc: any[], item) => {
      const existingGroup = acc.find(group => group.title === item.category);
      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        acc.push({ title: item.category, data: [item] });
      }
      return acc;
    }, [])
  : catalogItems;
  

  useEffect(() => {
    fetchItems();
  }, [filterByValue, sortByValue, state.shoppingItemLists]);

  if (loading) {
    <HStack space="sm">
      <Spinner />
      <Text size="md">Please Wait</Text>
    </HStack>;
  }

  const onPressCreateItemFunction = () => {
    setCreateButtonPressed(true);
  };

  const onPressCancelFunction = () => {
    setCreateButtonPressed(false);
  };

  const handleAddCustomItem = async (itemLabel: string, category: string) => {
    if (!itemLabel.trim()) return;

    const data = await getAllCatalogItems(db); 

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
      return; 
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
          <Box
            style={{
              ...StyleSheet.absoluteFillObject, 
              zIndex: 0,
            }}
          >
            <Image
              size="full"
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
                  {/* <Icon as={ThreeDotsIcon} size="xl" style={{color:"#FF6347"}} /> */}
                  <ThreeDotIconMenu
                      onFilterBySelect={(key) => {
                        setFilterByValue(key);
                      }}
                      onSortBySelect={(key) => {
                        setSortByValue(key);
                      }}
                      onGroupBySelect={(key) => {
                        setGroupByCategory(key);
                      }}
                  />
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
              {groupByCategory ? (
              <SectionList
                sections={groupedCatalogItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <ShoppingListItemComponent
                    shoppingList={item}
                    isModalOpen={showModal}
                    onCloseModal={() => setShowModal(false)}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Text className="font-semibold text-lg mt-3 mb-1 ml-2 text-gray-900">{title}</Text>
                )}
                contentContainerStyle={{
                  padding: 5,
                  paddingTop: isCreateButtonPressed ? "16%" : "10%",
                  paddingBottom: isCreateButtonPressed ? "16%" : "10%",
                }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                data={catalogItems}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <ShoppingListItemComponent
                    shoppingList={item}
                    isModalOpen={showModal}
                    onCloseModal={() => setShowModal(false)}
                  />
                )}
                contentContainerStyle={{
                  padding: 5,
                  paddingTop: isCreateButtonPressed ? "16%" : "10%",
                  paddingBottom: isCreateButtonPressed ? "16%" : "10%",
                }}
                showsVerticalScrollIndicator={false}
              />
            )}
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
                isChecked={isChecked(item.value)}
                onChange={() => handleCheckboxChange(item)}
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
