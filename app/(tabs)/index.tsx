import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ShoppingListItemPage from "../../components/ShoppingListItem";
import { Box } from "@/components/ui/box";
import AddCustomItem from "../../components/AddCustomItem";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import SortItem from "@/components/SortItem";
import FilterItem from "@/components/FilterItem";
import Notification from "@/components/Notification";
import { Text } from "@/components/ui/text";
import {getAllShoppingItems} from '../../db/queries'
import {CategoryItemResponseType} from '../../db/types'
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingListContext } from "@/service/store";


export default function Index() {
  const { state, dispatch } = useShoppingListContext();
  const [showModal, setShowModal] = React.useState(false);
  const [categoryItem, setCategoryItem] = useState<CategoryItemResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const db = useSQLiteContext();

  const fetchItems = async () => {
    const data = await getAllShoppingItems(db);
    setCategoryItem(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; 
  }
  console.log("from index")
  console.log(state.shoppingItems)

  return (
    <>
      <HStack space="xl" className="py-2 px-4 bg-background-dark">
        <Box className=" p-1 rounded-md flex-1" style={{ flex: 1 }}>
          {/* Place holder */}
          <SortItem />
        </Box>
        <Box className=" p-1 rounded-md flex-1" style={{ flex: 3 }}>
          <HStack space="lg" style={{ justifyContent: "flex-end" }}>
            <FilterItem />
            <Notification />
            <SortItem />
          </HStack>
        </Box>
      </HStack>

      <FlatList
        data={categoryItem}
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
        <AddCustomItem showModal={showModal} setShowModal={setShowModal} fetchItems={fetchItems}/>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({});
