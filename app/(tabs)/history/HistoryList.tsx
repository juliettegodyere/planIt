import { groupItemsByDate, transformToCategoryItemResponse } from "@/Util/HelperFunction";
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
import ItemInformationSheetController, { ItemInformationSheetHandle } from "@/components/ItemInformationSheetController";

const HistoryListScreen = () => {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists } = state;
  const [filteredItemsResult, setFilteredItemsResult] = useState<CategoryItemResponseType[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShoppingItemTypes[]>([]);
  const sheetRef = useRef<ItemInformationSheetHandle>(null);

  const router = useRouter();
  const db = useSQLiteContext();
  const { filterType } = useLocalSearchParams();

  const {addNewItemToShoppingItemsAndUpdateState, updateShoppingItemAndUpdateState,} = useShoppingActions();
  const { isChecked, handleCheckboxChange } = checkboxControlActions(db,state,dispatch,addNewItemToShoppingItemsAndUpdateState, updateShoppingItemAndUpdateState);

  useEffect(() => {
    let filteredItems: ShoppingItemTypes[] = [];
    let filteredItemsResult: CategoryItemResponseType[] = [];
    const fetchCategoryItems = async () => {
      const fullCategoryItems: CategoryItemResponseType[] = await getAllCatalogItems(db);
      if (filterType === "Selected") {
      filteredItems = selectedItemsNotPurchased;
      filteredItemsResult = transformToCategoryItemResponse(
        selectedItemsNotPurchased,
        fullCategoryItems
      );
    } else if (filterType === "Purchased") {
      console.log("History list page useEffect shoppingItemLists")
      console.log(shoppingItemLists)
      filteredItems = shoppingItemLists.filter(
        (item) => item.purchased=== true && item.key === ""
      );
      console.log("History list page useEffect filteredItems")
      console.log(filteredItems)
        filteredItemsResult = transformToCategoryItemResponse(
          selectedItemsAndPurchased,
          fullCategoryItems
        );
        console.log("History list page useEffect filteredItemsResult")
        console.log(filteredItemsResult)
    } else if (filterType === "Flagged") {
      filteredItems = selectedItemsNotPurchasedAndOverDue;
      filteredItemsResult = transformToCategoryItemResponse(
        selectedItemsNotPurchasedAndOverDue,
        fullCategoryItems
      );
    } else if (filterType === "All") {
      filteredItems = allItems;
      filteredItemsResult = transformToCategoryItemResponse(
        allItems,
        fullCategoryItems
      );
    } else {
      filteredItems = selectedItemsNotPurchased;
      filteredItemsResult = transformToCategoryItemResponse(
        selectedItemsNotPurchased,
        fullCategoryItems
      );
    }
      setFilteredItems(filteredItems);
      setFilteredItemsResult(filteredItemsResult)
    };
  
    fetchCategoryItems();
  }, [shoppingItemLists]);
  

  const handleSetSelectedItem = (item: CategoryItemResponseType): ShoppingItemTypes | undefined => {
    return state.shoppingItemLists.find(
      (i) =>
        i.name === item.label &&
        ((i.selected === true &&
        i.purchased === false) || (i.selected === false && i.purchased === true))
    );
  };

  const selectedItemsNotPurchased = shoppingItemLists.filter(
    (item) => item.selected && !item.purchased
  );

  const selectedItemsAndPurchased = shoppingItemLists.filter(
    (item) => item.purchased
  );

  const selectedItemsNotPurchasedAndOverDue = shoppingItemLists.filter(
    (item) => Date.now() > new Date(item.createDate).getTime()
  );

  const allItems = shoppingItemLists;

  // Now you can use:
  const result: CategoryItemResponseType[] = filteredItemsResult;

  const handleShowItemInformationActionsheet = () => {
   
    console.log("Testing")
  };
  const itemMap = Object.fromEntries(
    state.shoppingItemLists.map(i => [i.key, i])
  );
  
  const sections = groupItemsByDate(result, itemMap);
    console.log("History list page")
    console.log(filteredItemsResult)

    console.log("History list page shoppingItemLists")
    console.log(shoppingItemLists)

    console.log("History list page filterType")
    console.log(filterType)

    const handlePress = (selectedItem : ShoppingItemTypes, catalogItem: CategoryItemResponseType) => {
      sheetRef.current?.open(selectedItem, catalogItem); // ✅ opens the sheet from anywhere
    };

  return (
    <>
    <SectionList
        sections={sections}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          const selectedItem = handleSetSelectedItem(item);
            return (
                <ShoppingListCheckboxRow
                    shoppingList={item}
                    isChecked={isChecked}
                    handleCheckboxChange={handleCheckboxChange}
                    selectedItem={selectedItem}
                    onShowInfo={() => {
                      if (selectedItem) {
                        handlePress(selectedItem, item);
                      }
                    }}
                  />
                )
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="font-semibold text-lg mt-3 mb-1 ml-2 text-gray-900">{title}</Text>
        )}
        contentContainerStyle={{padding: 5}}
        showsVerticalScrollIndicator={false}
    />
    <ItemInformationSheetController ref={sheetRef} />
    </>
  );
};

export default HistoryListScreen;
