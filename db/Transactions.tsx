import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import { CategoriesType, CreateShoppingItemTypes, ShoppingItemTypes, guestUserType } from "../service/types";
import { getShoppingItemById, insertCategory, insertCategoryItem, insertGuestUser, insertShoppingItem, updateGuestUserDB, updateShoppingItem } from "./EntityManager";
import { addItem, setGuestUser, updateItem, updateGuestUser } from "@/service/stateActions";
import { generateSimpleUUID } from "@/Util/HelperFunction";

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
      //name: item.name,
      category_item_id: item.category_item_id,
      quantity: item.quantity,
      qtyUnit: item.qtyUnit,
      price: item.price,
      purchased: item.purchased,
      selected: item.selected,
      createDate: item.createDate,
      modifiedDate: item.modifiedDate,
      priority: item.priority,
      note: item.note
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
        quantity: entry.quantity ?? itemInDB.quantity,
        price: entry.price ?? itemInDB.price,
        qtyUnit: entry.qtyUnit ?? itemInDB.qtyUnit,
        purchased: entry.purchased ?? itemInDB.purchased,
        selected: entry.selected ?? itemInDB.selected,
        createDate: entry.createDate ?? itemInDB.createDate,
        modifiedDate: entry.modifiedDate ?? new Date().toISOString(),
        priority: entry.priority ?? itemInDB.priority,
        note: entry.note,
        key:entry.key
      };
      
      console.log("Item to be updated")
      console.log(updatedItem)
      await updateShoppingItem(db, updatedItem);
      dispatch(updateItem(itemInDB.key, updatedItem));
    //   console.log(state.shoppingItemLists);
  }

  const addUserDefinedCategory = async (label: string) => {
    const value = label.toLowerCase();

    const categoryId = await insertCategory(db, label, value);

    console.log(`Category added with ID: ${categoryId}`);
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
        id:"",
        key: value,
        name: label,
        category_item_id: "uncategorized",
        modifiedDate: now,
        createDate: now,
        price: "",
        purchased: false,
        selected: true,
        qtyUnit: "None",
        quantity: "1",
        priority: "Low",
        note: "",
        isSelectedShoppingItemsHydrated: true,
      };
      //Creates Item in DB and state
      console.log(`Item added is: ${newItem}`);
      await addNewItemToShoppingItemsAndUpdateState(newItem);
    } else {
      console.error("Category not found!");
    }
  };
  

  return {
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
    addUserDefinedCategory,
    addUserDefinedItem,
  };
};

export const userTransactions = () => {
  const { state, dispatch } = useShoppingListContext();
  const db = useSQLiteContext();

  const addNewGuestUserAndUpdateState = async () => {
    const savedUser = await insertGuestUser(db);
    dispatch(setGuestUser(savedUser));
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

  return {
    addNewGuestUserAndUpdateState,
    updateGuestUserAndUpdateState
  };
}
