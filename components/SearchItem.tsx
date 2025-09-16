import { Keyboard } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon, CloseCircleIcon } from "@/components/ui/icon";
import { useShoppingListContext } from "../service/store";
import { useRef, useState } from "react";
import { addItem, setCatalogItems, setShoppingItemsState } from "@/service/stateActions";
import { useSQLiteContext } from "expo-sqlite";
import { getAllCatalogItems, getAllShoppingItems } from "@/db/EntityManager";
import { HStack } from "./ui/hstack";
import { Button, ButtonText } from "./ui/button";
import { Pressable } from "./ui/pressable";
import { TextInput } from "react-native";
import { CategoryItemResponseType } from "@/service/types";
import { useShoppingActions } from "@/db/Transactions";
import { ShoppingListStateTypes } from "@/service/state";
export type SearchDataType = "catalog" | "shoppingList";

type SearchItemsProps = {
  showAddButton?: boolean; // control Add button visibility
  placeholder?: string; // custom placeholder text
  onSearch: (query: string) => void;
  filteredItems?: CategoryItemResponseType[];
  catalogItems?: CategoryItemResponseType[];
  setFilteredItems?: (data: CategoryItemResponseType[]) => void;
  dataType?: string;
  setLoading: (loading: boolean) => void;
};

export default function SearchItems({
  showAddButton = true,
  placeholder = "Search...",
  onSearch,
  filteredItems,
  catalogItems,
  setFilteredItems,
  dataType,
  setLoading,
}: SearchItemsProps) {
  const { state, dispatch } = useShoppingListContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const db = useSQLiteContext();
  const inputRef = useRef<TextInput>(null);
  const { addUserDefinedItem } = useShoppingActions();

  const showCancel = isFocused || searchQuery.length > 0;

  const handleClear = async() => {
    setLoading(true);
    setSearchQuery("");
    inputRef.current?.focus();
    onSearch("");

   try {
    if(dataType === "catalogItem"){
      const updatedCatalog = await getAllCatalogItems(db);
      dispatch(setCatalogItems(updatedCatalog));
    }else{
      const updateShoopingItem = await getAllShoppingItems(db);
      dispatch(setShoppingItemsState(updateShoopingItem))
    }
   } finally {
    setLoading(false);
   }
  };

  const handleCancel = async () => {
    setLoading(true);
    setSearchQuery("");
    setIsFocused(false);
    onSearch("");
    inputRef.current?.blur();

   try {
    if(dataType === "catalogItem"){
      const updatedCatalog = await getAllCatalogItems(db);
      dispatch(setCatalogItems(updatedCatalog));
    }else{
      const updateShoopingItem = await getAllShoppingItems(db);
      dispatch(setShoppingItemsState(updateShoopingItem))
    }
   } finally {
    setLoading(false);
   }
  };

  const handleAddNewItem = async (itemLabel: string, category: string) => {

    const addedItem = await addUserDefinedItem(itemLabel, category);

    if (addedItem != null) {
      dispatch(addItem(addedItem.shoppingItem));

      const query = itemLabel.trim();
      setSearchQuery(query);

      // const updatedList = [...catalogItems, addedItem.categoryItem].filter((item) =>
      // item.label.toLowerCase().includes(query.toLowerCase()));
      const updatedList = [...(catalogItems ?? []), addedItem.categoryItem].filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );

      setFilteredItems?.(updatedList);
    }
    
    setIsFocused(false);
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <HStack
      style={{
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <Input
        ref={inputRef}
        size="xl"
        style={{
          flex: 1,
          marginRight: searchQuery.length > 0 ? 8 : 0,
          borderWidth: 1,
          borderColor: isFocused ? "#FF6347" : "#E5E7EB",
          backgroundColor: "#F1F1F1",
          paddingHorizontal: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder={placeholder}
          value={searchQuery}
          // onChangeText={
          //   setSearchQuery
          // }
          onChangeText={(text) => {
            setSearchQuery(text);
            onSearch(text); // call parent’s handler
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (searchQuery === "") {
              setIsFocused(false);
            }
          }}
        />
        {searchQuery.length > 0 && (
          <InputSlot className="pl-2">
            <Pressable
              onPress={handleClear}
              className="mr-1"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <InputIcon as={CloseCircleIcon} size="2xs" />
            </Pressable>
          </InputSlot>
        )}
      </Input>

      {showAddButton && searchQuery.length > 0 && filteredItems?.length === 0 ? (
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            handleAddNewItem(searchQuery, "Uncategorized");
            handleCancel();
            Keyboard.dismiss(); // ✅ explicitly dismiss after add
          }}
          style={{ backgroundColor: "#FF6347" }}
        >
          <ButtonText>Add</ButtonText>
        </Button>
      ) : showCancel ? (
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            handleCancel();
            Keyboard.dismiss();
          }}
          style={{ backgroundColor: "#888888", marginLeft: 5 }}
        >
          <ButtonText>Clear</ButtonText>
        </Button>
      ) : null}
    </HStack>
  );
}
