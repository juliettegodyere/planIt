import { deleteShoppingItem, getCategoryByValue } from "@/db/EntityManager"; // update path
import { SQLiteDatabase } from "expo-sqlite";
import { ShoppingItemTypes, CategoryItemResponseType } from "@/service/types";
import { setSelectedShoppingItemsHydrated } from "@/service/stateActions";
import { DEFAULTS } from "@/Util/constants/defaults";

export const checkboxControlActions = (
  db: SQLiteDatabase,
  state: any,
  dispatch: React.Dispatch<any>,
  addNewItemToShoppingItemsAndUpdateState: (item: ShoppingItemTypes) => Promise<void>,
  updateShoppingItemAndUpdateState: (item: ShoppingItemTypes) => Promise<void>,
  deleteShoppingItemAndUpdateState?: (id: string) => Promise<void> // <-- Optional now
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
    console.log("handleCheckboxChange")
    console.log(item)
    const now = new Date().toISOString();
    const existingCategory = await getCategoryByValue(db, item.category);
    console.log(existingCategory)
    const existingItem = shoppingItemLists.find((i: ShoppingItemTypes) => i.key === item.value);
    console.log("handleCheckboxChange - existingItem")
    console.log(existingItem)

  //   if(existingItem ){
  //     const item_update: ShoppingItemTypes = {
  //       ...existingItem,
  //       selected: !existingItem.selected,
  //      // purchased: !existingItem.purchased,
  //       modifiedDate: now,
  //     };
  
  //     await updateShoppingItemAndUpdateState(item_update);
  //   }else{
    
  //   const newItem: ShoppingItemTypes = {
  //     id: "", // fill as needed
  //     key: item.value,
  //     name: item.label,
  //     category_item_id: existingCategory?.category_id || "uncategorized",
  //     modifiedDate: now,
  //     createDate: now,
  //     price: "",
  //     purchased: false,
  //     selected: true,
  //     qtyUnit: "None",
  //     quantity: "1",
  //     priority: "Low",
  //     note: "",
  //     reminderDate: now,           // <-- added
  //     reminderTime: now,           // <-- added
  //     isReminderDateEnabled: false,
  //     isReminderTimeEnabled: false,
  //     earlyReminder: "None",
  //     repeatReminder: "None",
  //     attachments: "[]",          // <-- stored as JSON string
  //   };
  //   setSelectedShoppingItemsHydrated(true);

  //   await addNewItemToShoppingItemsAndUpdateState(newItem);
  // };

  if(existingItem && existingItem.selected){

    await deleteShoppingItemAndUpdateState?.(existingItem.id);
  }else{
  
  const newItem: ShoppingItemTypes = {
    id: "", // fill as needed
    key: item.value,
    name: item.label,
    category_item_id: existingCategory?.category_id || "uncategorized",
    modifiedDate: now,
    createDate: now,
    price: DEFAULTS.PRICE,
    purchased: DEFAULTS.IS_PURCHASED,
    selected: true,
    qtyUnit: DEFAULTS.NONE,
    quantity: DEFAULTS.QUANTITY,
    priority: DEFAULTS.NONE,
    note: DEFAULTS.EMPTY,
    reminderDate: DEFAULTS.EMPTY,           // <-- added
    reminderTime: DEFAULTS.EMPTY,           // <-- added
    isReminderDateEnabled: DEFAULTS.IS_REMINDER_ENABLED,
    isReminderTimeEnabled: DEFAULTS.IS_REMINDER_ENABLED,
    earlyReminder: DEFAULTS.NONE,
    repeatReminder: DEFAULTS.REPEAT_NEVER,
    attachments: "[]",          // <-- stored as JSON string
  };
  setSelectedShoppingItemsHydrated(true);

  await addNewItemToShoppingItemsAndUpdateState(newItem);
};
  }
  return { isChecked, handleCheckboxChange };
};
