import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import {
  CategoriesType,
  CategoryItemResponseType,
  CreateShoppingItemTypes,
  ShoppingItemTypes,
  createUserType,
  guestUserType,
} from "../service/types";
import {
  deleteGuestUserDB,
  deleteShoppingItem,
  getCategoryByValue,
  getShoppingItemById,
  insertCategory,
  insertCategoryItem,
  insertGuestUser,
  insertShoppingItem,
  updateGuestUserDB,
  updateShoppingItem,
} from "./EntityManager";
import { removeGuestUser, setGuestUserHydrated } from "@/service/stateActions";
import { generateSimpleUUID } from "@/Util/HelperFunction";
import { DEFAULTS } from "@/Util/constants/defaults";
import { ShoppingListStateTypes } from "@/service/state";

type GuestUserUpdateParams = Partial<guestUserType> & { id: string };

export const useShoppingActions = () => {
  const db = useSQLiteContext();

  const addNewItemToShoppingItems = async (
    item: CreateShoppingItemTypes
  ): Promise<ShoppingItemTypes> => {
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
      attachments: item.attachments ?? "[]",
    };

    const savedItem = await insertShoppingItem(db, formattedItem);

    return savedItem.newItem;
  };

  const updateShoppingItemAndReturn = async (
    entry: ShoppingItemTypes
  ): Promise<ShoppingItemTypes> => {
    const itemInDB = await getShoppingItemById(db, entry.id);
    if (!itemInDB) throw new Error("Item not found in DB");

    const updatedItem: ShoppingItemTypes = {
      ...itemInDB,
      quantity:
        entry.quantity === DEFAULTS.QUANTITY
          ? itemInDB.quantity
          : entry.quantity,
      price: entry.price === DEFAULTS.PRICE ? itemInDB.price : entry.price,
      qtyUnit:
        entry.qtyUnit === DEFAULTS.QTY_UNIT ? itemInDB.qtyUnit : entry.qtyUnit,
      purchased: entry.purchased,
      selected: entry.selected,
      createDate: itemInDB.createDate,
      modifiedDate: entry.modifiedDate,
      priority:
        entry.priority === DEFAULTS.PRIORITY ? itemInDB.priority : entry.priority,
      note: entry.note === DEFAULTS.EMPTY ? itemInDB.note : entry.note,
      key: entry.key,
      attachments: entry.attachments,
      category_item_id: entry.category_item_id ?? itemInDB.category_item_id,
    };

    await updateShoppingItem(db, updatedItem);
    return updatedItem;
  };

  const deleteShoppingItemAndReturn = async (
    id: string
  ): Promise<ShoppingItemTypes | undefined> => {
    const itemInDB = await getShoppingItemById(db, id);

    if (!itemInDB) return;

    await deleteShoppingItem(db, id);

    // Return the deleted item for further processing
    return itemInDB;
  };

  const addUserDefinedCategory = async (label: string) => {
    const value = label.toLowerCase();
    const { id, message } = await insertCategory(db, label, value);
  };

 const addUserDefinedItem = async (
    label: string,
    categoryLabel: string
  ): Promise<{ 
    categoryItem: CategoryItemResponseType; 
    shoppingItem: ShoppingListStateTypes; 
  } | null> => {
    const value = `${label.toLowerCase()}_${Date.now()}`;
    const now = new Date().toISOString();

    // Find category id
    const allCategories = (await db.getAllAsync(
      "SELECT * FROM categories WHERE label = ?",
      [categoryLabel]
    )) as CategoriesType[];

    if (allCategories.length === 0) {
      console.error("Category not found!");
      return null;
    }

    const categoryId = allCategories[0].id;

     // Check if the category item already exists
      let existingCategoryItem = await db.getFirstAsync<{
        label: string;
        value: string;
        category_id: string;
      }>(
        "SELECT label, value, category_id FROM category_items WHERE label = ? AND category_id = ?",
        [label, categoryId]
      );

    // Insert category item - you might want to await or confirm this insertion separately
    //const newInsertedCategoryItem = await insertCategoryItem(db, label, value, categoryId);
    if (!existingCategoryItem) {
      // Insert new category item
      let t = await insertCategoryItem(db, label, value, categoryId);
      existingCategoryItem={
        label: t.label,
        value: t.value,
        category_id: t.category,
      }
    } else {
      // Map to CategoryItemResponseType
      existingCategoryItem = {
        //id: existingCategoryItem.id,
        label: existingCategoryItem.label,
        value: existingCategoryItem.value,
        category_id: existingCategoryItem.category_id,
      };
    }

    let existingShoppingItem = await db.getFirstAsync<ShoppingListStateTypes>(
      "SELECT * FROM shopping_items WHERE category_item_id = ? AND name = ? AND selected = ? AND purchased = ?",
      [existingCategoryItem.category_id, existingCategoryItem.label, true, false]
    );

    if (!existingShoppingItem) {
      const newItem: Omit<ShoppingListStateTypes, "id"> = {
        key: existingCategoryItem.value,
        name: label,
        category_item_id: categoryId,
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
  
      existingShoppingItem = await addNewItemToShoppingItems(newItem);

          // Return the saved item so caller can update global state
    }


    return {
      categoryItem: {
        label: existingCategoryItem.label,
        value: existingCategoryItem.value,
        category: existingCategoryItem.category_id,
      },
      shoppingItem: existingShoppingItem, // ✅ renamed from shoppingItem to savedItem
    };
  };

  const updateShoppingItemCategory = async (
    categoryLabel: string,
    selectedItem: ShoppingItemTypes
  ): Promise<ShoppingItemTypes | undefined> => {
    const now = new Date().toISOString();

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
      const newItem = {
        ...selectedItem,
        category_item_id: categoryId,
        modifiedDate: now,
        isSelectedShoppingItemsHydrated: true,
      };

      await updateShoppingItemAndReturn(newItem);
    } catch (error) {
      console.error("Failed to update item category:", error);
    }
  };

  const getCategoryById = async (
    categoryId: string
  ): Promise<CategoriesType | undefined> => {
    try {
      const result = await db.getFirstAsync<CategoriesType>(
        "SELECT * FROM categories WHERE id = ?",
        [categoryId]
      );

      if (!result) {
        console.error("Category not found!");
        return undefined;
      }
      return result;
    } catch (error) {
      console.error("Get category by Id failed:", error);
      return undefined;
    }
  };

  const getCategoryByName = async (
    categoryName: string
  ): Promise<CategoriesType | undefined> => {
    const category = await getCategoryByValue(db, categoryName);
    return category ?? undefined;
  };

  return {
    addNewItemToShoppingItems,
    updateShoppingItemAndReturn,
    addUserDefinedCategory,
    addUserDefinedItem,
    updateShoppingItemCategory,
    getCategoryById,
    deleteShoppingItemAndReturn,
    getCategoryByName,
  };
};

export const userTransactions = () => {
  const { state, dispatch } = useShoppingListContext();
  const db = useSQLiteContext();

  const addNewGuestUserToDB = async (
    user: createUserType
  ): Promise<guestUserType> => {

    const savedUser = await insertGuestUser(db, user);

    return savedUser;
  };

  const updateGuestUserInDB = async (user: GuestUserUpdateParams) => {
  
    const updatedUser = await updateGuestUserDB(db, user);
    return updatedUser;
  };

  const deleteGuestUser = async (id: string) => {

    await deleteGuestUserDB(db, id);
    dispatch(removeGuestUser());
    dispatch(setGuestUserHydrated(false));
  };

  return {
    addNewGuestUserToDB,
    updateGuestUserInDB,
    deleteGuestUser,
  };
};
