import { Box } from "@/components/ui/box";
import { useShoppingListContext } from "@/service/store";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  SectionList,
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Heading } from "@/components/ui/heading";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { useSQLiteContext } from "expo-sqlite";
import { Button, ButtonText } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ItemInformationSheetController, {
  ItemInformationSheetHandle,
} from "@/components/ItemInformationSheetController";
import { useShoppingActions } from "@/db/Transactions";
import { checkboxControlActions } from "@/hooks/checkboxControlActions";
import {
  formatDate,
  handleDeleteItem,
  handleUpdateQuantity,
  togglePurchased,
} from "@/Util/HelperFunction";
import ShoppingListCheckboxRow from "@/components/ShoppingListCheckboxRow";
import { Card } from "@/components/ui/card";
import QuantitySelector from "@/components/QuantitySelector";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import {
  updateReminderFields,
  getReminderByItemId,
  getAllShoppingItems,
} from "@/db/EntityManager";
import { router, useFocusEffect } from "expo-router";
import { ShoppingListStateTypes } from "@/service/state";
import ShoppingButton from "@/components/ShoppingButton";
import SearchItems from "@/components/SearchItem";
import { setShoppingItemsState } from "@/service/stateActions";
import { useShoppingItemActions } from "@/hooks/useShoppingItemActions";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";

type AntDesignIconName = keyof typeof AntDesignIcon.glyphMap;

type SortOrFilterOption = {
  name: "Selected" | "Purchased" | "All" | "Reminders";
  iconName: AntDesignIconName; // icon name as string
  selectedItems: ShoppingListStateTypes[];
  count?: number;
};

export default function History() {
  const { state, dispatch } = useShoppingListContext();
  const sheetRef = useRef<ItemInformationSheetHandle>(null);
  const { shoppingItemLists, catalogItems } = state;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Selected");
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const { createOrToggleShoppingItem, isCreating } = useShoppingItemActions(db);
  const {
    addNewItemToShoppingItems,
    deleteShoppingItemAndReturn,
    updateShoppingItemAndReturn,
  } = useShoppingActions();
  const { isChecked, handleCheckboxChange } = checkboxControlActions(
    db,
    state,
    dispatch,
    addNewItemToShoppingItems,
    deleteShoppingItemAndReturn
  );
  const [filteredItems, setFilteredItems] = useState<ShoppingListStateTypes[]>(
    []
  );
  useFocusEffect(
    useCallback(() => {
      setActiveTab("Selected");
      setActiveIndex(0);
    }, [])
  );

  const selectedItemsAndPurchased = shoppingItemLists.filter(
    (item) => !item.selected && item.purchased
  );
  const selectedItemsAndNotPurchased = shoppingItemLists.filter(
    (item) => item.selected && !item.purchased
  );

  useEffect(() => {
    // if (!shoppingItemLists || shoppingItemLists.length === 0) {
    //   setLoading(true);
    //   return;
    // }

    // setLoading(false);
    if (activeTab === "Selected") {
      setFilteredItems(selectedItemsAndNotPurchased);
    } else {
      setFilteredItems(selectedItemsAndPurchased);
    }
  }, [shoppingItemLists, activeTab]);

  const filteredItemsResult = catalogItems;

  const handleSetSelectedItem = (
    item: ShoppingListStateTypes
  ): CategoryItemResponseType | undefined => {
    //if (!item.selected || item.purchased) return undefined;

    const result = filteredItemsResult.find((it) => it.value === item.key);
    if (!result) {
      console.warn(`No match found for key: ${item.key}`);
      return undefined;
    }

    return result;
  };

  const handlePurchasedItem = (
    item: ShoppingListStateTypes
  ): CategoryItemResponseType | undefined => {
    //if (item.selected || !item.purchased) return undefined;

    const result = filteredItemsResult.find((it) => it.value === item.key);
    if (!result) {
      console.warn(`No match found for key: ${item.key}`);
      return undefined;
    }

    return result;
  };

  const sortFilterOptions: SortOrFilterOption[] = [
    {
      name: "Selected",
      iconName: "check",
      selectedItems: selectedItemsAndNotPurchased,
      count: selectedItemsAndNotPurchased.length,
    },
    {
      name: "Purchased",
      iconName: "shoppingcart",
      selectedItems: selectedItemsAndPurchased,
      count: selectedItemsAndPurchased.length,
    },
  ];

  const selectedGroupedItems = useMemo(() => {
    return (filteredItems ?? [])
      .filter((item) => !item.purchased)
      .reduce((acc, item) => {
        const sectionTitle = formatDate(new Date(item.modifiedDate));

        const existingSection = acc.find(
          (section) => section.title === sectionTitle
        );

        if (existingSection) {
          existingSection.data.push(item);
        } else {
          acc.push({
            title: sectionTitle,
            data: [item],
          });
        }

        return acc;
      }, [] as { title: string; data: ShoppingListStateTypes[] }[]);
  }, [filteredItems]); // only recalculates when filteredItems changes

  const purchasedGroupedItems = useMemo(() => {
    if (!filteredItems) return [];

    // Step 2: Keep only the most recent per name
    const uniquePurchasedItemsMap = new Map<string, ShoppingListStateTypes>();

    filteredItems.forEach((item) => {
      if (!item.purchased) return; // skip non-purchased items

      const existing = uniquePurchasedItemsMap.get(item.name);
      if (
        !existing ||
        new Date(item.modifiedDate) > new Date(existing.modifiedDate)
      ) {
        uniquePurchasedItemsMap.set(item.name, item);
      }
    });

    // Step 3: Convert map back to array
    const uniquePurchasedItems = Array.from(uniquePurchasedItemsMap.values());

    // Step 4: Group by modifiedDate
    return uniquePurchasedItems.reduce((acc, item) => {
      const sectionTitle = formatDate(new Date(item.modifiedDate));
      const existingSection = acc.find(
        (section) => section.title === sectionTitle
      );

      if (existingSection) {
        existingSection.data.push(item);
      } else {
        acc.push({ title: sectionTitle, data: [item] });
      }

      return acc;
    }, [] as { title: string; data: ShoppingListStateTypes[] }[]);
  }, [filteredItems]);

  const handleOnPress = (index: number, name: string, tab: string) => {
    setActiveIndex(index);
    setActiveTab(tab);
  };

  const handleProcessedItemOnPress = (id: string | number) => {
    router.push({
      pathname: "/others/[id]",
      params: {
        id: id.toString(),
      },
    });
  };

  const handleActionSheetPress = (
    selectedItem: ShoppingListStateTypes,
    catalogItem: CategoryItemResponseType
  ) => {
    sheetRef.current?.open(selectedItem, catalogItem); // ✅ opens the sheet from anywhere
  };

  const currentTab =
    activeTab === "Selected"
      ? selectedItemsAndPurchased
      : selectedItemsAndNotPurchased;

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(currentTab); // reset to all
      return;
    }
    setFilteredItems(
      shoppingItemLists.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex:1}}>
        <Center >
        <HStack space="sm">
        <Spinner size="large" color={colors.fuchsia[600]} />
        <Text size="md">Please Wait</Text>
      </HStack>
        </Center>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <SearchItems
          showAddButton={false}
          placeholder="Search..."
          onSearch={handleSearch}
          dataType="shoppingItem"
          setLoading={setLoading}
        />
        <VStack space="md" className="m-4">
          <Box
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: 10,
            }}
          >
            {sortFilterOptions.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                className="rounded-full"
                style={{
                  borderColor: activeIndex === index ? "#FF6347" : "#888888", // active outline
                  borderWidth: 2,
                }}
                onPress={() => handleOnPress(index, item.name, item.name)}
              >
                <ButtonText
                  size="sm"
                  className="text-center"
                  style={{
                    color: activeIndex === index ? "#FF6347" : "#888888", // active text color
                  }}
                >
                  {item.name}
                </ButtonText>
                <ButtonText
                  className="ml-2"
                  style={{
                    color: activeIndex === index ? "#FF6347" : "#888888", // active text color
                  }}
                >
                  {item.count === 0 ? "" : item.count}
                </ButtonText>
              </Button>
            ))}
          </Box>
          {activeTab === "Selected" ? (
            loading ? (
              <Center style={{ marginTop: 150 }}>
                <Spinner />
                {/* You can replace with your custom loader */}
              </Center>
            ) : selectedGroupedItems.length > 0 ? (
              <SectionList
                sections={selectedGroupedItems}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                  const selectedItem = handleSetSelectedItem(item);

                  if (!selectedItem) return null;
                  return (
                    <Card size="md" variant="elevated" className="m-1">
                      <VStack space="xl">
                        <HStack
                          space="4xl"
                          style={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <ShoppingListCheckboxRow
                            shoppingList={selectedItem}
                            shoppingItem={item}
                            isChecked={isChecked}
                            shoppingItemLists={shoppingItemLists}
                            dispatch={dispatch}
                            deleteShoppingItemAndReturn={
                              deleteShoppingItemAndReturn
                            }
                            //handleCheckboxChange={handleCheckboxChange}
                          />
                          <AntDesignIcon
                            size={20}
                            name="arrowsalt"
                            color="#888"
                            onPress={() =>
                              handleActionSheetPress(item, selectedItem)
                            }
                            className="max-w-[20%]"
                          />
                        </HStack>

                        <HStack space="2xl" className="mb-3">
                          <QuantitySelector
                            quantity={item.quantity}
                            onIncrease={() =>
                              handleUpdateQuantity(
                                1,
                                item,
                                dispatch,
                                updateShoppingItemAndReturn
                              )
                            }
                            onDecrease={() =>
                              handleUpdateQuantity(
                                -1,
                                item,
                                dispatch,
                                updateShoppingItemAndReturn
                              )
                            }
                            onDelete={() =>
                              handleDeleteItem(
                                item.id,
                                selectedItem,
                                shoppingItemLists,
                                dispatch,
                                deleteShoppingItemAndReturn
                              )
                            }
                          />
                          <Box>
                            <ShoppingButton
                              label={
                                item.purchased
                                  ? "Purchased"
                                  : "Mark as purchased"
                              }
                              variant={item.purchased ? "solid" : "outline"}
                              size="md"
                              color="#FF6347"
                              onPress={() =>
                                togglePurchased(
                                  item,
                                  dispatch,
                                  updateShoppingItemAndReturn,
                                  db,
                                  getReminderByItemId,
                                  updateReminderFields,
                                  true
                                )
                              }
                            />
                          </Box>
                        </HStack>
                      </VStack>
                    </Card>
                  );
                }}
                contentContainerStyle={{ paddingBottom: 150 }}
                renderSectionHeader={({ section: { title } }) => (
                  <VStack className="p-3">
                    <Heading size="xl" style={{ color: "#333333" }}>
                      {title}
                    </Heading>
                  </VStack>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Center
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 150,
                }}
              >
                <Image
                  source={require("assets/images/undraw_empty-cart_574u.png")}
                  alt="empty cart"
                  size="2xl"
                  resizeMode="contain"
                  className="rounded-md"
                />
              </Center>
            )
          ) : loading ? (
            <Center style={{ marginTop: 150 }}>
              <Spinner />
              {/* You can replace with your custom loader */}
            </Center>
          ) : purchasedGroupedItems.length > 0 ? (
            <SectionList
              sections={purchasedGroupedItems}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                const isPurchased = handlePurchasedItem(item);
                const isAlreadyInCart = state.shoppingItemLists.some(
                  (i) => i.name === isPurchased?.label && i.purchased === false
                );
                const itemByName: ShoppingListStateTypes[] =
                  shoppingItemLists.filter(
                    (entry: ShoppingListStateTypes) =>
                      entry.name === isPurchased?.label
                  );
                if (!isPurchased) return null;
                return (
                  <Card size="md" variant="elevated" className="m-1">
                    <HStack className="justify-between">
                      <Text
                        size="xl"
                        className="font-bold"
                        style={{ color: "#333333" }}
                      >
                        {item.name}
                      </Text>
                      <AntDesignIcon
                        size={20}
                        name="arrowsalt"
                        color="#888"
                        onPress={() => handleProcessedItemOnPress(item.id)}
                        className="max-w-[20%]"
                      />
                    </HStack>
                    <Box className="mt-2">
                      <Text size="md" className="font-medium">
                        Purchased {itemByName.length} times
                      </Text>
                    </Box>
                    <HStack space="lg" className="mt-2">
                      {isAlreadyInCart ? (
                        <Box>
                          <Text style={{ color: "#888888", fontSize: 12 }}>
                            Item is already in the cart. Click on the icon to
                            view purchase history.
                          </Text>
                        </Box>
                      ) : (
                        <>
                          <ShoppingButton
                            label="Undo purchase"
                            variant="outline"
                            size="sm"
                            color="#888888"
                            onPress={() =>
                              togglePurchased(
                                item,
                                dispatch,
                                updateShoppingItemAndReturn,
                                db,
                                getReminderByItemId,
                                updateReminderFields,
                                false
                              )
                            }
                          />
                          <ShoppingButton
                            label="Buy it again"
                            variant="solid"
                            size="sm"
                            color="#FF6347"
                            onPress={() =>
                              createOrToggleShoppingItem(isPurchased)
                            }
                          />
                        </>
                      )}
                    </HStack>
                  </Card>
                );
              }}
              contentContainerStyle={{ paddingBottom: 150 }}
              renderSectionHeader={({ section: { title } }) => (
                <VStack className="p-3">
                  <Heading size="xl" style={{ color: "#333333" }}>
                    {title}
                  </Heading>
                </VStack>
              )}
            />
          ) : (
            <Center
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 150,
              }}
            >
              <Image
                source={require("assets/images/undraw_empty-cart_574u.png")}
                alt="empty cart"
                size="2xl"
                resizeMode="contain"
                className="rounded-md"
              />
            </Center>
          )}
          <ItemInformationSheetController ref={sheetRef} />
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
