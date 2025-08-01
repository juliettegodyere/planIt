import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import { CategoriesType, CreateShoppingItemTypes, ShoppingItemTypes, guestUserType } from "../service/types";
import { deleteGuestUserDB, deleteShoppingItem, getCategoryByValue, getShoppingItemById, insertCategory, insertCategoryItem, insertGuestUser, insertShoppingItem, updateGuestUserDB, updateShoppingItem } from "./EntityManager";
import { addItem, addGuestUser, updateItem, updateGuestUser, removeGuestUser, removeItem } from "@/service/stateActions";
import { generateSimpleUUID } from "@/Util/HelperFunction";
import { DEFAULTS } from "@/Util/constants/defaults";

type GuestUserUpdateParams = Partial<guestUserType> & { id: string };

export const useShoppingActions = () => {
  const { state, dispatch } = useShoppingListContext();
  const db = useSQLiteContext();

  const addNewItemToShoppingItemsAndUpdateState = async (item: CreateShoppingItemTypes) => {
    const id = await generateSimpleUUID(); 
    const formattedItem = {
      ...item,
      id,
      key: item.key,
      name: item.name,
      category_item_id: item.category_item_id,
      quantity: item.quantity,
      qtyUnit: item.qtyUnit,
      price: item.price,
      purchased: item.purchased,
      selected: item.selected,
      createDate: item.createDate,
      modifiedDate: item.modifiedDate,
      priority: item.priority,
      note: item.note,
      reminderDate: item.reminderDate ?? '',                 // string
      reminderTime: item.reminderTime ?? '',                 // string
      isReminderTimeEnabled: item.isReminderTimeEnabled ?? false,  // boolean
      isReminderDateEnabled: item.isReminderDateEnabled ?? false,  // boolean
      earlyReminder: item.earlyReminder ?? '',
      repeatReminder: item.repeatReminder ?? '',
      attachments: item.attachments ?? '[]',                 // JSON string
    };    

    console.log("addNewItemToShoppingItemsAndUpdateState - formattedItem")
    console.log(formattedItem)

    const savedItem = await insertShoppingItem(db, formattedItem);
    console.log("From Add item function - insert response");
    console.log(savedItem);
    dispatch(addItem(savedItem.newItem));
    console.log("addNewItemToShoppingItemsAndUpdateState - After dispatch");
    console.log(state.shoppingItemLists);
  };

  const updateShoppingItemAndUpdateState = async (entry: ShoppingItemTypes) => {
    console.log("I got inside updateShoppingItemAndUpdateState")
    console.log(entry)
    const itemInDB = await getShoppingItemById(db, entry.id);
    console.log("updateShoppingItemAndUpdateState - after getShoppingItemById")
    console.log(itemInDB)
    if (!itemInDB) return;

    const updatedItem: ShoppingItemTypes = {
      ...itemInDB,
      quantity: entry.quantity === DEFAULTS.QUANTITY ? itemInDB.quantity : entry.quantity,
      price: entry.price === DEFAULTS.PRICE? itemInDB.price : entry.price,
      qtyUnit: entry.qtyUnit === DEFAULTS.NONE? itemInDB.qtyUnit : entry.qtyUnit,
      purchased: entry.purchased,
      selected: entry.selected,
      createDate: itemInDB.createDate,
      modifiedDate: entry.modifiedDate,
      priority: entry.priority === DEFAULTS.NONE ? itemInDB.priority : entry.priority,
      note: entry.note === DEFAULTS.EMPTY ? itemInDB.note : entry.note,
      key: entry.key,
      reminderDate: entry.reminderDate === DEFAULTS.EMPTY? itemInDB.reminderDate:entry.reminderDate,
      reminderTime: entry.reminderTime  === DEFAULTS.EMPTY? itemInDB.reminderTime : entry.reminderTime,
      isReminderTimeEnabled: entry.isReminderTimeEnabled === DEFAULTS.IS_REMINDER_ENABLED
        ? itemInDB.isReminderTimeEnabled
        : entry.isReminderTimeEnabled,

      isReminderDateEnabled: entry.isReminderDateEnabled === DEFAULTS.IS_REMINDER_ENABLED
        ? itemInDB.isReminderDateEnabled
        : entry.isReminderDateEnabled,
      earlyReminder: entry.earlyReminder === DEFAULTS.NONE ? itemInDB.earlyReminder : entry.earlyReminder,
      repeatReminder: entry.repeatReminder === DEFAULTS.REPEAT_NEVER ? itemInDB.repeatReminder : entry.repeatReminder,
      attachments: entry.attachments,
      //category_item_id: itemInDB.category_item_id
      category_item_id: entry.category_item_id? entry.category_item_id: itemInDB.category_item_id
    };    
      
      console.log("Item to be updated")
      console.log(updatedItem)
      await updateShoppingItem(db, updatedItem);
      dispatch(updateItem(itemInDB.id, updatedItem));
    //   console.log(state.shoppingItemLists);
  }

  const deleteShoppingItemAndUpdateState = async (id: string) => {
    console.log("I got inside deleteShoppingItemAndUpdateState")
    console.log(id)
    const itemInDB = await getShoppingItemById(db, id);
    console.log("deleteShoppingItemAndUpdateState - after getShoppingItemById")
    console.log(itemInDB)
    if (!itemInDB) return;

      await deleteShoppingItem(db, id);
      dispatch(removeItem(itemInDB.id));
    //   console.log(state.shoppingItemLists);
  }

  const addUserDefinedCategory = async (label: string) => {
    const value = label.toLowerCase();

    // const categoryId = await insertCategory(db, label, value);
    const { id, message } = await insertCategory(db, label, value);

    console.log(`Category added with ID: ${id}`);
    console.log(`Category added with ID: ${message}`);
  };

  const addUserDefinedItem = async (label: string, categoryLabel: string) => {
    const value = `${label.toLowerCase()}_${Date.now()}`;
    const now = new Date().toISOString();

    const allCategories = (await db.getAllAsync(
      "SELECT * FROM categories WHERE label = ?",
      [categoryLabel]
    )) as CategoriesType[];

    if (allCategories.length > 0) {
      const categoryId = allCategories[0].id;

      await insertCategoryItem(db, label, value, categoryId);
      console.log(`Item added with categoryId: ${categoryId}`);
      const newItem = {
        id: "",
        key: value,
        name: label,
        category_item_id: categoryId,
        modifiedDate: now,
        createDate: now,
        price: DEFAULTS.PRICE,
        purchased: DEFAULTS.IS_PURCHASED,
        selected: true,
        qtyUnit: DEFAULTS.NONE,
        quantity: DEFAULTS.QUANTITY,
        priority: DEFAULTS.NONE,
        note: DEFAULTS.EMPTY,
        isSelectedShoppingItemsHydrated: true,
        reminderDate: DEFAULTS.EMPTY,           // <-- added
        reminderTime: DEFAULTS.EMPTY,           // <-- added
        isReminderDateEnabled: DEFAULTS.IS_REMINDER_ENABLED,
        isReminderTimeEnabled: DEFAULTS.IS_REMINDER_ENABLED,
        earlyReminder: DEFAULTS.NONE,
        repeatReminder: DEFAULTS.REPEAT_NEVER,
        attachments: "[]",          // <-- stored as JSON string
      };      
      //Creates Item in DB and state
      console.log(`Item added is: ${newItem}`);
      await addNewItemToShoppingItemsAndUpdateState(newItem);
    } else {
      console.error("Category not found!");
    }
  };

  const updateShoppingItemCategory = async (categoryLabel: string, selectedItem: ShoppingItemTypes) => {
    const now = new Date().toISOString();
    console.log("updateShoppingItemCategory - selectedItem - The selected item")
    console.log(selectedItem)

    try {
      const allCategories = (await db.getAllAsync(
        "SELECT * FROM categories WHERE label = ?",
        [categoryLabel]
      )) as CategoriesType[];
  
      if (allCategories.length === 0) {
        console.error("Category not found!");
        return;
      }

      const categoryId = allCategories[0].id;
      console.log("updateShoppingItemCategory Item added with category")
      console.log( allCategories[0])
      console.log( allCategories[0].id)
        const newItem = {
          ...selectedItem,
          category_item_id: categoryId,
          modifiedDate: now,
          isSelectedShoppingItemsHydrated: true,
        };      
  
        console.log(`Item Updated is: ${newItem}`);
        await updateShoppingItemAndUpdateState(newItem);
    } catch (error) {
      console.error("Failed to update item category:", error);
    }
  };

  const getCategoryById = async (categoryId: string): Promise<CategoriesType | undefined> => {
    console.log("getCategoryById");
    console.log(categoryId);
  
    try {
      const result = await db.getFirstAsync<CategoriesType>(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId]
      );
  
      if (!result) {
        console.error("Category not found!");
        return undefined;
      }
      console.log("result")
      console.log(result)
      return result;
    } catch (error) {
      console.error("Get category by Id failed:", error);
      return undefined;
    }
  };  

  const getCategoryByName = async (categoryName: string): Promise<CategoriesType | undefined> => {
    const category = await getCategoryByValue(db, categoryName);
    console.log("category - getCategoryByValue");
    console.log(category);
    return category ?? undefined; // normalize null to undefined
  };  

  return {
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    addUserDefinedCategory,
    addUserDefinedItem,
    updateShoppingItemCategory,
    getCategoryById,
    deleteShoppingItemAndUpdateState,
    getCategoryByName
  };
};

export const userTransactions = () => {
  const { state, dispatch } = useShoppingListContext();
  const db = useSQLiteContext();

  const addNewGuestUserAndUpdateState = async () => {
    const savedUser = await insertGuestUser(db);
    dispatch(addGuestUser(savedUser));
    return savedUser;
  }

  // const updateGuestUserAndUpdateState = async (user: guestUserType) => {
  //   const updatedUser = await updateGuestUserDB(db, user);
  //   dispatch(updateGuestUser(updatedUser));
  //   return updatedUser;
  // }
  const updateGuestUserAndUpdateState = async (user: GuestUserUpdateParams) => {
    console.log("updateGuestUserAndUpdateState")
    console.log(user)
    const updatedUser = await updateGuestUserDB(db, user);
    dispatch(updateGuestUser(updatedUser));
    return updatedUser;
  }

  const deleteGuestUser = async (id:string) => {
    console.log("deleteGuestUser")
    console.log(id)
    await deleteGuestUserDB(db, id);
    dispatch(removeGuestUser());
  }

  return {
    addNewGuestUserAndUpdateState,
    updateGuestUserAndUpdateState,
    deleteGuestUser
  };
}
