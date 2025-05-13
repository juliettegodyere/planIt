import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ShoppingListItemPage from "../../components/ShoppingListItem";
import { Box } from "@/components/ui/box";
import AddCustomItem from "../../components/AddCustomItem";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { getAllShoppingItems } from "../../db/queries";
import { CategoryItemResponseType } from "../../db/types";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";
import { categoryOptions } from "@/data/dataStore";
import { Spinner } from "@/components/ui/spinner"
import { setInventoryItems } from "@/service/stateActions";

export default function Index() {
  const { state, dispatch } = useShoppingListContext();
  const {inventoryItems} = state
  const [showModal, setShowModal] = React.useState(false);
  const [inventoryItem, setInventoryItem] = useState<
    CategoryItemResponseType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();
  const [selectedCat, setSelectedCat] = useState("All");

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

    const filtered = selectedCat === "All"
    ? sorted
    : sorted.filter(item => item.category === selectedCat);

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
    </HStack>
  }

  const toggleSelect = (label: string) => {
    setSelectedCat(label);
  };

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pt-3 pb-2 px-4"
      >
        <HStack
          space="lg"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {categoryOptions.map((cat, idx) => {
            const isSelected = selectedCat == cat.label;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => toggleSelect(cat.label)}
                className={`px-4 py-2 rounded-full 
          background ${
            isSelected
              ? "bg-blue-500 border-blue-500"
              : "bg-white border-gray-300"
          }
          `}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 36, // Ensures consistent vertical space
                }}
              >
                <Text
                  style={{
                    color: isSelected ? "#fff" : "#4B5563", // tailwind text-gray-600
                    fontWeight: "500",
                    fontSize: 14,
                    lineHeight: 18, // Prevents vertical folding
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </HStack>
      </ScrollView>

      <FlatList
        data={inventoryItems}
        renderItem={({ item }) => <ShoppingListItemPage shoppingList={item} />}
        keyExtractor={(item) => item.value}
      />
      <Box
        className="bg-background-50 rounded-md"
        style={{ flex: 1, marginBottom: 90 }}
      >
        <Fab
          size="lg"
          placement="bottom right"
          onPress={() => setShowModal(true)}
        >
          <FabIcon as={AddIcon} size="xl" />
        </Fab>
        <AddCustomItem
          showModal={showModal}
          setShowModal={setShowModal}
          fetchItems={fetchItems}
        />
      </Box>
    </>
  );
}

const styles = StyleSheet.create({});
