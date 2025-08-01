import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  ScrollView,
} from "react-native";
import { Box } from "@/components/ui/box";
import { AddIcon, Icon, ThreeDotsIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { CategoryItemResponseType } from "../../service/types";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";
import { Spinner } from "@/components/ui/spinner";
import { setCatalogItems } from "@/service/stateActions";
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
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
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
  const [isCreateButtonPressed, setCreateButtonPressed] = useState(false);
  const [customItem, setCustomItem] = useState("");
  const { addUserDefinedItem } = useShoppingActions();
  const [similarItems, setSimilarItems] = useState<CategoryItemResponseType[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSimilarItems, setSelectedSimilarItems] = useState<string[]>(
    []
  );
  const {
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    deleteShoppingItemAndUpdateState,
  } = useShoppingActions();
  const [sortByValue, setSortByValue] = useState<string>("Marked Items");
  const [filterByValue, setFilterByValue] = useState<string>("All");
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);
  const { isChecked, handleCheckboxChange } = checkboxControlActions(
    db,
    state,
    dispatch,
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    deleteShoppingItemAndUpdateState
  );

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCatalogItems(db);
      dispatch(setCatalogItems(data)); // just fetch and store
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  }, [db, dispatch]);
  
  // 2. Call it inside useEffect
  useEffect(() => {
    if (db) {
      fetchItems();
    }
  }, [db, fetchItems]);

  const filteredAndSortedItems = useMemo(() => {
    const selectedKeys = state.shoppingItemLists
      .filter((item) => item.selected)
      .map((item) => item.key);

    let result = [...catalogItems];

    if (sortByValue === "Marked Items") {
      result.sort((a, b) => {
        const aIsSelected = selectedKeys.includes(a.value);
        const bIsSelected = selectedKeys.includes(b.value);
        if (aIsSelected && !bIsSelected) return -1;
        if (!aIsSelected && bIsSelected) return 1;
        return a.label.localeCompare(b.label);
      });
    } else if (sortByValue === "Alphabet") {
      result.sort((a, b) => a.label.localeCompare(b.label));
    }

    if (filterByValue.toLowerCase() !== "all") {
      result = result.filter(
        (item) => item.category.toLowerCase() === filterByValue.toLowerCase()
      );
    }

    return result;
  }, [catalogItems, state.shoppingItemLists, sortByValue, filterByValue]);

  const groupedCatalogItems = useMemo(() => {
    if (!groupByCategory) return [];

    return filteredAndSortedItems.reduce((acc: any[], item) => {
      const existingGroup = acc.find((group) => group.title === item.category);
      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        acc.push({ title: item.category, data: [item] });
      }
      return acc;
    }, []);
  }, [filteredAndSortedItems, groupByCategory]);

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
      threshold: 0.2,
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

    // Check for exact or plural match
    const existingItem = similarItems.find((item) => {
      const label = item.label.trim().toLowerCase();
      return (
        label === entered || label === `${entered}s` || `${label}s` === entered
      );
    });

    if (existingItem) {
      Alert.alert(
        "Item Already Exists",
        `"${existingItem.label}" already exists. You can select it from the list or slightly change the name.`
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

  if (loading) {
    return (
      <HStack space="sm">
        <Spinner />
        <Text size="md">Please Wait</Text>
      </HStack>
    );
  }

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
                    <Heading size="xl" className="text-gray-900">
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
                          <Text className="text-md font-bold">Add Item</Text>
                        </Pressable>
                      </HStack>
                      {/* <BookImage size={15} color="#888" /> */}
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
                          {/* <AntDesignIcon
                            size={15}
                            name="arrowsalt"
                            color="#888"
                            onPress={() => setShowModal(true)}
                          /> */}
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
                      <Text className="font-semibold text-lg mt-3 mb-1 ml-2 text-gray-900">
                        {title}
                      </Text>
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
                    data={filteredAndSortedItems}
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
            <Heading
              className="text-typography-950 font-semibold mb-2"
              size="md"
            >
              Similar Item(s) Found for {customItem}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <ScrollView style={{ maxHeight: 300 }}>
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
                  <CheckboxLabel>
                    {item.label} ({item.category})
                  </CheckboxLabel>
                </Checkbox>
              ))}
            </ScrollView>
          </AlertDialogBody>
          <AlertDialogFooter className="flex-row justify-between px-4 pb-3 pt-4">
            <Pressable
              onPress={() => {
                setShowSuggestions(false);
                setSimilarItems([]);
                setSelectedSimilarItems([]);
                setCustomItem("");
              }}
              disabled={!hasSelectedSimilarItems()}
              style={{
                opacity: hasSelectedSimilarItems() ? 1 : 0.5,
              }}
            >
              <Text className="font-extrabold" style={{ color: "#3498db" }}>
                Use Selected Item
              </Text>
            </Pressable>

            {/* ➕ Add Anyway button (only if customItem is typed and not an exact/plural match) */}
            <Pressable
              onPress={handleAddUserDefinedItemEvenIfItExist}
              disabled={!customItem.trim()}
              style={{
                opacity: customItem.trim() ? 1 : 0.5,
              }}
            >
              <Text
                className="font-extrabold"
                style={{
                  color: customItem.trim() ? "#FF6347" : "#ccc",
                }}
              >
                Add New Item
              </Text>
            </Pressable>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const styles = StyleSheet.create({});
