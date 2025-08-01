import { Box } from "@/components/ui/box";
import { useShoppingListContext } from "@/service/store";
import { useRouter } from "expo-router";
import { Text, View, FlatList, Pressable, SectionList } from "react-native";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { Heading } from "@/components/ui/heading";
import { Icon, ChevronRightIcon } from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { getAllCatalogItems } from "@/db/EntityManager";
import { useSQLiteContext } from "expo-sqlite";
import {
  formatDate,
  isReminderDue,
  transformToCategoryItemResponse,
} from "@/Util/HelperFunction";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal"
import { Button, ButtonText } from "@/components/ui/button";

type AntDesignIconName = keyof typeof AntDesignIcon.glyphMap;

type SortOrFilterOption = {
  name: "Selected" | "Purchased" | "All" | "Flagged";
  iconName: AntDesignIconName; // icon name as string
  selectedItems: ShoppingItemTypes[];
};

export default function History() {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists } = state;

  const router = useRouter();
  const db = useSQLiteContext();

  const selectedItemsNotPurchased = shoppingItemLists.filter(
    (item) => item.selected && !item.purchased
  );

  const selectedItemsAndPurchased = shoppingItemLists.filter(
    (item) => !item.selected && item.purchased
  );

  const selectedItemsNotPurchasedAndOverDue = shoppingItemLists.filter(
    (item) =>
      item.selected &&
      !item.purchased &&
      isReminderDue(
        item.reminderDate,
        item.reminderTime,
        item.earlyReminder ?? "None",
        item.repeatReminder ?? "None"
      )
  );

  const allItems = shoppingItemLists;

  const sortFilterOptions: SortOrFilterOption[] = [
    {
      name: "Selected",
      iconName: "check",
      selectedItems: selectedItemsNotPurchased,
    },
    {
      name: "Purchased",
      iconName: "shoppingcart",
      selectedItems: selectedItemsAndPurchased,
    },
    // {
    //   name: "All",
    //   iconName: "appstore-o",
    //   selectedItems: allItems,
    // },
    // { name: "Flagged", 
    // iconName: "flag", 
    // selectedItems: selectedItemsNotPurchasedAndOverDue },

    //Add most selected items && also filter by category
  ];

  const handleOnPress = async (type: string, data: ShoppingItemTypes[]) => {
    router.push({
      pathname: "/others/HistoryList",
      params: {
        filterType: type,
        selectedData: JSON.stringify(data), 
      },
    });
  };  
  
  return (
    <VStack>
      <Box
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          padding: 10,
        }}
      >
         {sortFilterOptions.map((item, index) => (
          <Card
            key={index}
            style={{
              width: 150,
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#ffffff",
            }}
          >
            <Pressable onPress={() => handleOnPress(item.name,item.selectedItems)}>
              <HStack className="justify-between">
                <AntDesignIcon size={25} name={item.iconName} color="#888" />
                <Heading size="lg">{item.selectedItems.length}</Heading>
              </HStack>
              <Heading size="lg" className="mt-2">
                {item.name}
              </Heading>
            </Pressable>
          </Card>
        ))}

      </Box>
    </VStack>
  );
}