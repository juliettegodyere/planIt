import {
  formatDate,
  groupItemsByDate,
  isReminderDue,
  transformToCategoryItemResponse,
} from "@/Util/HelperFunction";
import ShoppingListCheckboxRow from "@/components/ShoppingListCheckboxRow";
import { getAllCatalogItems, getFullCategoryItems } from "@/db/EntityManager";
import { useShoppingActions } from "@/db/Transactions";
import { checkboxControlActions } from "@/hooks/checkboxControlActions";
import { useShoppingListContext } from "@/service/store";
import { Text } from "@/components/ui/text";
import { format } from "date-fns";
import {
  CategoryItemResponseType,
  FullCategoryItem,
  ShoppingItemTypes,
} from "@/service/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import { FlatList, SectionList } from "react-native";
import ItemInformationSheetController, {
  ItemInformationSheetHandle,
} from "@/components/ItemInformationSheetController";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";

const HistoryListScreen = () => {
  const { state, dispatch } = useShoppingListContext();
  const [filteredItemsResult, setFilteredItemsResult] = useState<
    CategoryItemResponseType[]
  >([]);
  const [filteredItems, setFilteredItems] = useState<ShoppingItemTypes[]>([]);
  const sheetRef = useRef<ItemInformationSheetHandle>(null);

  const router = useRouter();
  const db = useSQLiteContext();
  const { selectedData, filterType } = useLocalSearchParams();

  const {
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    deleteShoppingItemAndUpdateState,
  } = useShoppingActions();
  const { isChecked, handleCheckboxChange } = checkboxControlActions(
    db,
    state,
    dispatch,
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    deleteShoppingItemAndUpdateState
  );

  useEffect(() => {
    if (selectedData) {
      try {
        const parsed = JSON.parse(selectedData as string);
        setFilteredItems(parsed);
      } catch (error) {
        console.error("Invalid data received:", error);
      }
    }
  }, [selectedData]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fullCategoryItems: CategoryItemResponseType[] =
          await getAllCatalogItems(db);
        setFilteredItemsResult(fullCategoryItems); // You can apply filtering logic here if needed
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    if (db) {
      fetchItems();
    }
  }, [db]);

  const groupedShoppingItems = filteredItems.reduce((acc, item) => {
    const sectionTitle = formatDate(new Date(item.modifiedDate)); // e.g., "Today", "1 week ago", or date string

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
  }, [] as { title: string; data: ShoppingItemTypes[] }[]);

  const handleSetSelectedItem = (
    item: ShoppingItemTypes
  ): CategoryItemResponseType | undefined => {
    if (!item.selected || item.purchased) return undefined;

    const result = filteredItemsResult.find((it) => it.value === item.key);
    if (!result) {
      console.warn(`No match found for key: ${item.key}`);
      return undefined;
    }

    return result;
  };

  if (!filteredItemsResult.length) {
    return <Spinner />;
  }

  const handleProcessedItemOnPress = (id: string | number) => {
    router.push({
      pathname: "/others/[id]",
      params: {
        id: id.toString(), 
      },
    });
  };

  const handlePress = (selectedItem : ShoppingItemTypes, catalogItem: CategoryItemResponseType) => {
    sheetRef.current?.open(selectedItem, catalogItem); // ✅ opens the sheet from anywhere
  };

  return (
    <>
      <SectionList
        sections={groupedShoppingItems}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const selectedItem = handleSetSelectedItem(item);

          if (filterType === "Selected" || filterType === "Flagged") {
            if (!selectedItem) return null;

            return (
              <ShoppingListCheckboxRow
                shoppingList={selectedItem}
                isChecked={isChecked}
                handleCheckboxChange={handleCheckboxChange}
                selectedItem={item}
                onShowInfo={() => {
                  console.log(selectedItem)
                  console.log(item)
                  if (selectedItem) {
                    handlePress(item, selectedItem);
                  }
                }}
              />
            );
          }

          return (
            <Box className="p-3">
              <Card>
                <Pressable onPress={() => handleProcessedItemOnPress(item.id)}>
                  <HStack className="justify-between w-full">
                    <VStack className="max-w-[80%]">
                      <Text className="text-xl ml-1 text-gray-900">{item.name}</Text>
                    </VStack>
                    <Icon
                      as={ChevronRightIcon}
                      size="lg"
                      className="text-gray-900 max-w-[20%]"
                    />
                  </HStack>
                </Pressable>
              </Card>
            </Box>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <VStack className="p-3">
            <Heading className="">{title}</Heading>
          </VStack>
        )}
      />

      <ItemInformationSheetController ref={sheetRef} />
    </>
  );
};

export default HistoryListScreen;
