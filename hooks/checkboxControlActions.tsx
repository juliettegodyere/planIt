import { getCategoryByValue } from "@/db/EntityManager"; // update path
import { SQLiteDatabase } from "expo-sqlite";
import { ShoppingItemTypes, CategoryItemResponseType } from "@/service/types";
import { setSelectedShoppingItemsHydrated } from "@/service/stateActions";

export const checkboxControlActions = (
  db: SQLiteDatabase,
  state: any,
  dispatch: React.Dispatch<any>,
  addNewItemToShoppingItemsAndUpdateState: (item: ShoppingItemTypes) => Promise<void>,
  updateShoppingItemAndUpdateState: (item: ShoppingItemTypes) => Promise<void>
) => {
  const { shoppingItemLists } = state;

  const isChecked = (key: string) => {
    if (!shoppingItemLists || shoppingItemLists.length === 0) return false;

    const item = shoppingItemLists.find(
      (item: ShoppingItemTypes) => item.key === key
    );

    if (!item) return false;
    return item.selected;
  };

  const handleCheckboxChange = async (item: CategoryItemResponseType) => {
    const now = new Date().toISOString();
    const existingCategory = await getCategoryByValue(db, item.category);
    
    const existingItem = shoppingItemLists.find((i: ShoppingItemTypes) => i.key === item.value);

    if(existingItem){
      const item_update: ShoppingItemTypes = {
        ...existingItem,
        selected: !existingItem.selected,
       // purchased: !existingItem.purchased,
        modifiedDate: now,
      };
  
      await updateShoppingItemAndUpdateState(item_update);
    }else{
    
    const newItem: ShoppingItemTypes = {
      id: "", // fill as needed
      key: item.value,
      name: item.label,
      category_item_id: existingCategory?.category_id || "uncategorized",
      modifiedDate: now,
      createDate: now,
      price: "",
      purchased: false,
      selected: true,
      qtyUnit: "None",
      quantity: "1",
      priority: "Low",
      note: ""
    };
    setSelectedShoppingItemsHydrated(true);

    await addNewItemToShoppingItemsAndUpdateState(newItem);
  };
  }
  return { isChecked, handleCheckboxChange };
};
