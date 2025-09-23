import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FlatList,
  StyleSheet,
  SectionList,
  View,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { CategoryItemResponseType } from "../../service/types";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";
import { Spinner } from "@/components/ui/spinner";
import {
  setCatalogItems,
} from "@/service/stateActions";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { getAllCatalogItems } from "@/db/EntityManager";
import { useShoppingActions } from "@/db/Transactions";
import ShoppingListItemComponent from "../../components/ShoppingListItemComponent";
import ThreeDotIconMenu from "@/components/ThreeDotIconMenu";
import { Card } from "@/components/ui/card";
import QuantitySelector from "@/components/QuantitySelector";
import { handleDeleteItem, handleUpdateQuantity } from "@/Util/HelperFunction";
import { Button, ButtonText } from "@/components/ui/button";
import { useShoppingItemActions } from "@/hooks/useShoppingItemActions";
import SearchItems from "@/components/SearchItem";
import colors from "tailwindcss/colors"
import Fuse from "fuse.js";

export default function Index() {
  const { state, dispatch } = useShoppingListContext();
  const { catalogItems } = state;
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const db = useSQLiteContext();
  const [isCreateButtonPressed, setCreateButtonPressed] = useState(false);
  const [filteredItems, setFilteredItems] = useState<CategoryItemResponseType[]>([]);

  const {
    updateShoppingItemAndReturn,
    deleteShoppingItemAndReturn,
  } = useShoppingActions();

  const [filterByValue, setFilterByValue] = useState<string>("All");
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);
  const [sortByValue, setSortByValue] = useState<string>("Marked Items");
  const { createOrToggleShoppingItem, isCreating } = useShoppingItemActions(db);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllCatalogItems(db);
      dispatch(setCatalogItems(data)); // fetch all the presaved shopping items
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [db, dispatch]);

  useEffect(() => {
    if (db) {
      fetchItems();
    }
  }, [db, fetchItems]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems();
  }, []);

  useEffect(() => {
    if (!loading && catalogItems.length > 0) {
      setFilteredItems(catalogItems);
    }
  }, [catalogItems, loading]);

  const fuse = new Fuse(catalogItems, {
    keys: ["label", "value"],
    threshold: 0.2, // lower = stricter, higher = fuzzier
    includeScore: true,
    ignoreLocation: true,
  });

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredItems(catalogItems); // reset to all
      return;
    }
    // setFilteredItems(
    //   catalogItems.filter((item) =>
    //     item.label.toLowerCase().includes(query.toLowerCase())
    //   )
    // );

     // Use Fuse for fuzzy searching
    const results = fuse.search(query);

    // Map results back to items
    const matchedItems = results.map(r => r.item);
    setFilteredItems(matchedItems);
  };

const filteredAndSortedItems = useMemo(() => {
  const selectedKeys = state.shoppingItemLists
    .filter((item) => item.selected)
    .map((item) => item.key); // ✅ use value consistently

  let result = [...filteredItems];

  if (sortByValue === "Alphabet") {
    // sort everything alphabetically
    result.sort((a, b) => a.label.localeCompare(b.label));
  } else if (sortByValue === "Marked Items") {
    // split into selected vs unselected
    const selectedItems = result.filter((item) =>
      selectedKeys.includes(item.value)
    );
    const unselectedItems = result.filter(
      (item) => !selectedKeys.includes(item.value)
    );

    // ✅ keep selected items in their original order (as added)
    // ✅ but sort unselected alphabetically
    unselectedItems.sort((a, b) => a.label.localeCompare(b.label));

    result = [...selectedItems, ...unselectedItems];
  }

  if (filterByValue.toLowerCase() !== "all") {
    result = result.filter(
      (item) => item.category.toLowerCase() === filterByValue.toLowerCase()
    );
  }

  return result;
}, [
  catalogItems,
  filterByValue,
  filteredItems,
  state.shoppingItemLists,
  sortByValue,
]);


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

  if (loading) {
    return (
      <HStack space="sm">
        <Spinner size="large" color={colors.fuchsia[600]}/>
        <Text size="md">Please Wait...</Text>
      </HStack>
    );
  }
  return (
      <SafeAreaView style={{ flex: 1}}>
        <View >
        <SearchItems
            showAddButton={true}
            placeholder="Search or add an item"
            onSearch={handleSearch}
            filteredCatelogItems={filteredItems}
            catalogItems={catalogItems}
            setFilteredCatelogItems={setFilteredItems}
            dataType="catalogItem"
            setLoading={setLoading}
          />
        </View>
        <View style={{ flex: 1, padding: 15 }}>
        <HStack space="md" className="justify-between bottom-1">
          <Heading size="xl" style={{ color: "#333333" }}>
            Shoppinglist
          </Heading>
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
        {groupByCategory ? (
          <SectionList
          sections={groupedCatalogItems}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const globalItem = state.shoppingItemLists.find(
                    (i) =>
                      i.key === item.value &&
                      i.selected === true &&
                      i.purchased === false
                  );
            return (
              <ShoppingListItemComponent
                shoppingList={item}
                globalItem={globalItem}
                dispatch={dispatch}
                updateShoppingItemAndReturn={updateShoppingItemAndReturn}
                shoppingItemLists={state.shoppingItemLists}
                deleteShoppingItemAndReturn={deleteShoppingItemAndReturn}
              />
            )}
          }
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
          ListFooterComponent={loading ? <Spinner size="large" /> : null}
          ListEmptyComponent={!loading ? <Text>No items</Text> : null}
        />
        ):(
          <FlatList
          data={filteredAndSortedItems ?? []}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const globalItem = state.shoppingItemLists.find(
              (i) =>
                i.key === item.value &&
                i.selected === true &&
                i.purchased === false
            );
            return (
              <Card size="md" variant="elevated" className="m-1">
                <VStack space="xl">
                  <Text
                    size="xl"
                    className="font-bold"
                    style={{ color: "#333333" }}
                  >
                    {item.label}
                  </Text>
                  {globalItem === undefined ||
                  Number(globalItem?.quantity) === 0 ? (
                    <Button
                      variant="solid"
                      size="md"
                      className="rounded-full "
                      style={{ backgroundColor: "#FF6347", width: "40%" }}
                      // onPress={() => handleCreateShoppingItem(item)}
                      onPress={() => createOrToggleShoppingItem(item)}
                      //isDisabled={isCreating}  // disable while creating
                    >
                      <ButtonText>
                        Add to basket
                      </ButtonText>
                    </Button>
                  ) : (
                    <QuantitySelector
                      quantity={globalItem.quantity}
                      onIncrease={() =>
                        handleUpdateQuantity(
                          1,
                          globalItem,
                          dispatch,
                          updateShoppingItemAndReturn
                        )
                      }
                      onDecrease={() =>
                        handleUpdateQuantity(
                          -1,
                          globalItem,
                          dispatch,
                          updateShoppingItemAndReturn
                        )
                      }
                      onDelete={() =>
                        handleDeleteItem(
                          globalItem.id,
                          item,
                          state.shoppingItemLists,
                          dispatch,
                          deleteShoppingItemAndReturn
                        )
                      }
                      //borderColor="#FF6347"
                      // width="50%" // override if needed
                    />
                  )}
                </VStack>
              </Card>
            );
          }}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 5,
            paddingTop: isCreateButtonPressed ? 24 : 16, // numbers, not "16%"
            paddingBottom: isCreateButtonPressed ? 24 : 16,
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={loading ? <Spinner size="large" /> : null}
          ListEmptyComponent={!loading ? <Text>No items</Text> : null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        )}
      </View>
      </SafeAreaView>
    //   </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
