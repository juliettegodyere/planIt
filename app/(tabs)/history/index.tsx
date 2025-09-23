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
import Fuse from "fuse.js";

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
  const prevFilteredItems = useRef<ShoppingListStateTypes[]>([]);

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

  // useEffect(() => {
  //   if (activeTab === "Selected") {
  //     setFilteredItems(selectedItemsAndNotPurchased);
  //   } else {
  //     setFilteredItems(selectedItemsAndPurchased);
  //   }
  // }, [shoppingItemLists, activeTab]);

  useEffect(() => {
    const updatedItems =
      activeTab === "Selected"
        ? selectedItemsAndNotPurchased
        : selectedItemsAndPurchased;

    // Keep previous items until new ones are ready
    if (updatedItems.length > 0) {
      prevFilteredItems.current = updatedItems;
    }

    setFilteredItems(prevFilteredItems.current);
  }, [activeTab, shoppingItemLists]);

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
    if (!filteredItems) return [];
  
    // 🚀 Pre-filter only once
    const notPurchased = filteredItems.filter((item) => !item.purchased);
  
    if (notPurchased.length === 0) return [];
  
    // 🚀 Use a Map for grouping (faster than acc.find)
    const groupedMap = new Map<string, ShoppingListStateTypes[]>();
  
    notPurchased.forEach((item) => {
      const sectionTitle = formatDate(new Date(item.modifiedDate));
      if (!groupedMap.has(sectionTitle)) {
        groupedMap.set(sectionTitle, []);
      }
      groupedMap.get(sectionTitle)!.push(item);
    });
  
    // 🚀 Convert map back to array
    const grouped = Array.from(groupedMap.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  
    // 🚀 Sort each section’s items (newest → oldest)
    grouped.forEach((section) => {
      section.data.sort(
        (a, b) =>
          new Date(b.modifiedDate).getTime() -
          new Date(a.modifiedDate).getTime()
      );
    });
  
    // 🚀 Sort sections by most recent modifiedDate
    return grouped.sort((a, b) => {
      const aDate = Math.max(...a.data.map((i) => new Date(i.modifiedDate).getTime()));
      const bDate = Math.max(...b.data.map((i) => new Date(i.modifiedDate).getTime()));
      return bDate - aDate; // newest first
    });
  }, [filteredItems]);
  

  const purchasedGroupedItems = useMemo(() => {
    if (!filteredItems) return [];

    // Step 1: Keep only the most recent per name
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

    // Step 2: Convert map back to array
    const uniquePurchasedItems = Array.from(uniquePurchasedItemsMap.values());

    // Step 3: Group by formatted date
    const grouped = uniquePurchasedItems.reduce((acc, item) => {
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

    // Step 4: Sort items inside each group (newest → oldest)
    grouped.forEach((section) => {
      section.data.sort(
        (a, b) =>
          new Date(b.modifiedDate).getTime() -
          new Date(a.modifiedDate).getTime()
      );
    });
    // Step 5: Remove empty sections
    const nonEmptySections = grouped.filter(
      (section) => section.data.length > 0
    );

    // Step 6: Sort sections by most recent modifiedDate
    return nonEmptySections.sort((a, b) => {
      const aDate = Math.max(
        ...a.data.map((i) => new Date(i.modifiedDate).getTime())
      );
      const bDate = Math.max(
        ...b.data.map((i) => new Date(i.modifiedDate).getTime())
      );
      return bDate - aDate; // newest first
    });
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
    try {
      sheetRef.current?.open(selectedItem, catalogItem);
    } catch (error) {
      console.error("An error occured while opening Actionsheet", error);
    }
  };

  const currentTab =
    activeTab === "Selected"
      ? selectedItemsAndPurchased
      : selectedItemsAndNotPurchased;

  // const handleSearch = (query: string) => {
  //   if (!query) {
  //     setFilteredItems(currentTab); // reset to all
  //     return;
  //   }
  //   setFilteredItems(
  //     shoppingItemLists.filter((item) =>
  //       item.name.toLowerCase().includes(query.toLowerCase())
  //     )
  //   );
  // };

  const fuse = new Fuse(shoppingItemLists, {
    keys: ["label", "value"],
    threshold: 0.2, // lower = stricter, higher = fuzzier
    includeScore: true,
    ignoreLocation: true,
  });

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(currentTab); // reset to all
      return;
    }
    // setFilteredItems(
    //   shoppingItemLists.filter((item) =>
    //     item.label.toLowerCase().includes(query.toLowerCase())
    //   )
    // );

     // Use Fuse for fuzzy searching
    const results = fuse.search(query);

    // Map results back to items
    const matchedItems = results.map(r => r.item);
    setFilteredItems(matchedItems);
  };

  // 🔹 Common renderer for both tabs
  function RenderGroupedSectionList({
    loading,
    groupedItems,
    renderItem,
  }: {
    loading: boolean;
    groupedItems: { title: string; data: ShoppingListStateTypes[] }[];
    renderItem: ({
      item,
    }: {
      item: ShoppingListStateTypes;
    }) => JSX.Element | null;
  }) {
    if (loading) {
      return (
        <Center style={{ marginTop: 150 }}>
          <Spinner />
        </Center>
      );
    }

    if (groupedItems.length === 0) {
      return (
        <Center style={{ marginTop: 150 }}>
          <Image
            source={require("assets/images/undraw_empty-cart_574u.png")}
            alt="empty cart"
            size="2xl"
            resizeMode="contain"
            className="rounded-md"
          />
        </Center>
      );
    }

    return (
      <SectionList
        sections={groupedItems}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
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
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Center>
          <HStack space="sm">
            <Spinner size="large" color={colors.fuchsia[600]} />
            <Text size="md">Please Wait</Text>
          </HStack>
        </Center>
      </SafeAreaView>
    );
  }
  //console.log("state.shoppingItemLists", state.shoppingItemLists)
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
          filteredShoppingItems={filteredItems}
          shoppingItemLists={shoppingItemLists}
          setFilteredShoppingItems={setFilteredItems}
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
          {activeTab === "Selected" && (
            <RenderGroupedSectionList
              loading={loading}
              groupedItems={selectedGroupedItems}
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
                              item.purchased ? "Purchased" : "Mark as purchased"
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
            />
          )}
          {activeTab === "Purchased" && (
            <RenderGroupedSectionList
              loading={loading}
              groupedItems={purchasedGroupedItems}
              renderItem={({ item }) => {
                const isPurchased = handlePurchasedItem(item);
                const isAlreadyInCart = state.shoppingItemLists.some(
                  (i) => i.name === isPurchased?.label && i.purchased === false
                );
                const itemByName: ShoppingListStateTypes[] =
                  shoppingItemLists.filter(
                    (entry: ShoppingListStateTypes) =>
                      entry.name === isPurchased?.label && entry.purchased
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
            />
          )}

          <ItemInformationSheetController ref={sheetRef} />
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
