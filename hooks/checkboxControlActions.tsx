import { getCategoryByValue } from "@/db/EntityManager"; // update path
import { SQLiteDatabase } from "expo-sqlite";
import { CategoryItemResponseType, CreateShoppingItemTypes } from "@/service/types";
import { addItem, removeItem, setSelectedShoppingItemsHydrated } from "@/service/stateActions";
import { DEFAULTS } from "@/Util/constants/defaults";
import { ShoppingListStateTypes } from "@/service/state";

export const checkboxControlActions = (
  db: SQLiteDatabase,
  state: any,
  dispatch: React.Dispatch<any>,
  addNewItemToDbAndUpdateState: (item: CreateShoppingItemTypes) => Promise<ShoppingListStateTypes>,
  deleteFromDbAndUpdateState?: (id: string) => Promise<ShoppingListStateTypes | undefined> 
) => {
  const { shoppingItemLists } = state;

  const isChecked = (key: string, id: string) => {
    if (!shoppingItemLists || shoppingItemLists.length === 0) return false;

    const item = shoppingItemLists.find(
      (item: ShoppingListStateTypes) => item.key === key && item.id === id
    );

    if (!item) return false;
    return item.selected;
  };

  const handleCheckboxChange = async (item: CategoryItemResponseType) => {
    const now = new Date().toISOString();
    const existingCategory = await getCategoryByValue(db, item.category);
    const existingItem = shoppingItemLists.find((i: ShoppingListStateTypes) => i.key === item.value);

  if(existingItem && existingItem.selected){
    await deleteFromDbAndUpdateState?.(existingItem.id);
    dispatch(removeItem(existingItem.id));
  }else{
  
  const newItem: ShoppingListStateTypes = {
    id: "", // fill as needed
    key: item.value,
    name: item.label,
    category_item_id: existingCategory?.category_id || "uncategorized",
    modifiedDate: now,
    createDate: now,
    price: DEFAULTS.PRICE,
    purchased: DEFAULTS.IS_PURCHASED,
    selected: true,
    qtyUnit: DEFAULTS.QTY_UNIT,
    quantity: DEFAULTS.QUANTITY,
    priority: DEFAULTS.PRIORITY,
    note: DEFAULTS.EMPTY,
    attachments: "[]", 
  };

  setSelectedShoppingItemsHydrated(true);

  const addedItem = await addNewItemToDbAndUpdateState(newItem);
  if (addedItem != null) {
    dispatch(addItem(addedItem));
  }
};
  }
  return { isChecked, handleCheckboxChange };
};
