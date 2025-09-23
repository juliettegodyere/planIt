import { Keyboard } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon, CloseCircleIcon } from "@/components/ui/icon";
import { useShoppingListContext } from "../service/store";
import { useEffect, useRef, useState } from "react";
import {
  addItem,
  setCatalogItems,
  setShoppingItemsState,
} from "@/service/stateActions";
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
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert"
import { InfoIcon } from "@/components/ui/icon"

type CategoryItemWithNewFlag = CategoryItemResponseType & { isNew?: boolean };

type SearchItemsProps = {
  showAddButton?: boolean; // control Add button visibility
  placeholder?: string; // custom placeholder text
  onSearch: (query: string) => void;
  filteredCatelogItems?: CategoryItemResponseType[];
  catalogItems?: CategoryItemResponseType[];
  setFilteredCatelogItems?: (data: CategoryItemResponseType[]) => void;
  filteredShoppingItems?: ShoppingListStateTypes[];
  shoppingItemLists?: ShoppingListStateTypes[];
  setFilteredShoppingItems?: (data: ShoppingListStateTypes[]) => void;
  dataType?: string;
  setLoading: (loading: boolean) => void;
};

export default function SearchItems({
  showAddButton = true,
  placeholder = "Search...",
  onSearch,
  filteredCatelogItems,
  catalogItems,
  setFilteredCatelogItems,
  filteredShoppingItems,
  shoppingItemLists,
  setFilteredShoppingItems,
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertAction, setAlertAction] = useState<"muted" | "info" | "success" | "warning" | "error">("info");

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleClear = () => {
    setLoading(true);
    setSearchQuery("");
    onSearch("");
    Keyboard.dismiss(); // ✅ just dismiss, don’t re-focus

    if (dataType === "catalogItem") {
      setFilteredCatelogItems?.(catalogItems ?? []);
    } else {
      setFilteredShoppingItems?.(shoppingItemLists ?? []);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    setSearchQuery("");
    setIsFocused(false);
    onSearch("");
    inputRef.current?.blur();
    Keyboard.dismiss();

    try {
      if (dataType === "catalogItem") {
        setFilteredCatelogItems?.(catalogItems ?? []);
      } else {
        setFilteredShoppingItems?.(shoppingItemLists ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewItem = async (itemLabel: string, category: string) => {
    try {
      // 1) create the DB + app item
      const addedItem = await addUserDefinedItem(itemLabel, category);
      if (!addedItem) return;
  
      // 2) add to shopping items (if required)
      dispatch(addItem(addedItem.shoppingItem));
  
      // 3) update catalog with the new item at the top
      const updatedCatalog = [addedItem.categoryItem, ...(catalogItems ?? [])];
      dispatch(setCatalogItems(updatedCatalog));
  
      // 4) update filtered results:
      const filteredResults = [
        addedItem.categoryItem,
        ...updatedCatalog.filter(
          (it) =>
            it.value !== addedItem.categoryItem.value &&
            it.label.toLowerCase().includes(itemLabel.toLowerCase())
        ),
      ];
      setFilteredCatelogItems?.(filteredResults);
  
      // 5) Keep the input showing the new item's label
      setSearchQuery(addedItem.categoryItem.label);
  
      // 6) Keep focus so the user can continue (optional)
      setIsFocused(true);
      inputRef.current?.focus();
    } catch (error: any) {
      setAlertAction("error");
      setAlertMessage(error.message || "Item already exists in this category");
    }
  };
  

  const normalizeWord = (word: string) => {
    let lower = word.toLowerCase().trim();
    
    if (lower.endsWith("ies")) {
      // berries → berry
      lower = lower.slice(0, -3) + "y";
    } else if (
      lower.endsWith("ches") ||
      lower.endsWith("shes") ||
      lower.endsWith("xes") ||
      lower.endsWith("zes") ||
      lower.endsWith("ses")
    ) {
      // matches plural forms like boxes → box, matches → match
      lower = lower.slice(0, -2);
    } else if (lower.endsWith("s") && lower.length > 1) {
      // apples → apple
      lower = lower.slice(0, -1);
    }
  
    if (lower.endsWith("ed") && lower.length > 2) {
      // cooked → cook
      lower = lower.slice(0, -2);
    }
  
    return lower;
  };

  const matchesExistingItem = (
    query: string,
    items: { label: string }[] | undefined
  ) => {
    if (!query || !items) return false;
  
    const normalizedQuery = normalizeWord(query);
    //console.log("normalizedQuery", normalizedQuery)
    console.log("query", query.toLowerCase())
  
    return items.some((item) => {
      const normalizedItem = normalizeWord(item.label);
      console.log("item.label", item.label.toLowerCase())

      //console.log("normalizedItem", normalizedItem)
     
      return (
        item.label.toLowerCase() !== query.toLowerCase() || // exact match
        normalizedItem === normalizedQuery // plural/past tense match
      );
    });
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
      {/* ✅ Alert goes here */}
    {alertMessage && (
      <Alert action={alertAction} variant="solid" className="mb-3">
        <AlertIcon as={InfoIcon} />
        <AlertText>{alertMessage}</AlertText>
      </Alert>
    )}
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

      {/* {showAddButton && searchQuery.length > 0 && (
        (dataType === "catalogItem" && filteredCatelogItems?.length === 0) ||
        (dataType === "shoppingItem" && filteredShoppingItems?.length === 0)
      ) ? (
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
      ) : null} */}
      {showAddButton &&
      searchQuery.length > 0 &&
      dataType === "catalogItem" &&
      filteredCatelogItems?.length === 0 &&
      !matchesExistingItem(searchQuery, catalogItems) ? (
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            handleAddNewItem(searchQuery, "Uncategorized");
           // handleCancel();
            Keyboard.dismiss();
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
