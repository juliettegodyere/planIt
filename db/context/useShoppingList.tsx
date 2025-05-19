// context/useShoppingList.ts

import {
  insertShoppingItem,
  insertCategory,
  insertCategoryItem,
  updateShoppingItem,
} from "../shoppingItems";
import {
  ShoppingListAction,
  useShoppingListContext,
} from "../../service/store";
import { ShoppingItem } from "../../service/state";
import { ShoppingItemDB, Category } from "../types";
import { addItem, addNewEntry } from "../../service/stateActions";
import { getShoppingItemById } from "../queries";
import { PriorityLevel } from "@/service/PriorityLevel";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";

export const useShoppingActions = () => {
  const {state, dispatch } = useShoppingListContext();
  const db = useSQLiteContext();

  const addNewItemToDB = async (item: ShoppingItem) => {
    const formattedItem = {
      ...item,
      //id:item.id,
      key: item.key,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      qtyUnit: item.qtyUnit,
      price: item.price,
      purchased: item.purchased,
      selected: item.selected,
      createDate: item.createDate,
      modifiedDate: item.modifiedDate,
      priority: item.priority,
    };

    const savedItem = await insertShoppingItem(db, formattedItem);
    console.log("From Add item function - insert response");
    console.log(savedItem);
    dispatch(addItem(savedItem));
    console.log(state.shoppingItems[0])
  };

  const appendItemHistory = async (newEntry: ShoppingItem) => {
    console.log("I got inside appendItemHistory")
    const itemInDB = await getShoppingItemById(db, newEntry.id);
    console.log(itemInDB)
    if (!itemInDB) return;

    const updatedItem: ShoppingItem = {
      ...itemInDB,
      quantity: [...itemInDB.quantity, newEntry.quantity.at(-1) ?? 1],
      price: [...itemInDB.price, newEntry.price.at(-1) ?? ""],
      qtyUnit: [...itemInDB.qtyUnit, newEntry.qtyUnit.at(-1) ?? "None"],
      purchased: [...itemInDB.purchased, newEntry.purchased.at(-1) ?? false],
      selected: [...itemInDB.selected, newEntry.selected.at(-1) ?? true],
      createDate: [
        ...itemInDB.createDate,
        newEntry.createDate.at(-1) ?? new Date().toISOString(),
      ],
      modifiedDate: [
        ...itemInDB.modifiedDate,
        newEntry.modifiedDate.at(-1) ?? new Date().toISOString(),
      ],
      priority: [
        ...itemInDB.priority,
        newEntry.priority.at(-1) ?? "Low",
      ],
    };
    console.log("Item to be updated")
    console.log(updatedItem)
    await updateShoppingItem(db, updatedItem);
  };
  //Appends a new entry to an existing item
  const updateExistingItemInDB = async (newEntry: ShoppingItem) => {
    console.log("I got inside updateExistingItemInDB")
    await appendItemHistory(newEntry);
    dispatch(addNewEntry(newEntry));
  };
  //Updates the state and DB during partial update like when user enters a new price
  const updateShoppingItemFields = async (
    itemId: string,
    updates: Partial<ShoppingItem>,
    actionCreator: (id: string, dataToBeUpdated: ShoppingItem) => ShoppingListAction
  ) => {
    console.log("The partial object")
    console.log(updates)
    console.log(updates.selected)
    console.log(updates.purchased)
    const existingItem = await getShoppingItemById(db, itemId);
    console.log("I got to updateShoppingItemFields function");
    console.log(existingItem);
    if (!existingItem) return;

    const now = new Date().toISOString();

    const updatedItem: ShoppingItem = {
      ...existingItem,

      // Toggle selected if key exists in updates
      selected: updates.selected !== undefined
        ? [...existingItem.selected.slice(0, -1), !existingItem.selected.at(-1)!]
        : [...existingItem.selected.slice(0, -1), existingItem.selected.at(-1)!],

      // Toggle purchased if key exists in updates
      purchased: updates?.purchased !== undefined
        ? [
            ...existingItem.purchased.slice(0, -1),
            !existingItem.purchased.at(-1)!,
          ]
        : [...existingItem.purchased.slice(0, -1), existingItem.purchased.at(-1)!],

      price:
        updates.price !== undefined
          ? [...existingItem.price.slice(0, -1), updates.price.at(-1)!]
          : [...existingItem.price.slice(0, -1), existingItem.price.at(-1)!],

      quantity:
        updates.quantity !== undefined
          ? [...existingItem.quantity.slice(0, -1), updates.quantity.at(-1)!]
          : [...existingItem.quantity.slice(0, -1), existingItem.quantity.at(-1)!],

      qtyUnit:
        updates.qtyUnit !== undefined
          ? [...existingItem.qtyUnit.slice(0, -1), updates.qtyUnit.at(-1)!]
          : [...existingItem.qtyUnit.slice(0, -1), existingItem.qtyUnit.at(-1)!],

      priority:
        updates.priority !== undefined
          ? [...existingItem.priority.slice(0, -1), updates.priority.at(-1)!]
          : [...existingItem.priority.slice(0, -1), existingItem.priority.at(-1)!],

      modifiedDate: [...existingItem.modifiedDate.slice(0, -1), now],
    };
    console.log("The update data");
    //This code shows that selected is toggled false
    console.log(updatedItem);
    //await updateShoppingItem(db, updatedItem);
    const updateItem = await updateShoppingItem(db, updatedItem);
    console.log("The updated data");
    //This code shows that selected is toggled false
    console.log(updateItem);
    console.log()
    dispatch(actionCreator(updateItem.key, updateItem));
    console.log(updateItem.id)
    console.log("from updateShoppingItemFields function after dispatch")
    // This code shows that the global state does not return the changes made rather the old object
    console.log(state.shoppingItems[0])
  };

  const addUserDefinedCategory = async (label: string) => {
    const value = label.toLowerCase();

    const categoryId = await insertCategory(db, label, value);

    console.log(`Category added with ID: ${categoryId}`);
  };

  const addUserDefinedItem = async (label: string, categoryLabel: string) => {
    const value = `${label.toLowerCase()}_${Date.now()}`;
    console.log(value);

    const allCategories = (await db.getAllAsync(
      "SELECT * FROM categories WHERE label = ?",
      [categoryLabel]
    )) as Category[];

    if (allCategories.length > 0) {
      const categoryId = allCategories[0].id;

      await insertCategoryItem(db, label, value, categoryId);
      console.log(`Item added with categoryId: ${categoryId}`);
    } else {
      console.error("Category not found!");
    }
  };

  return {
    addNewItemToDB,
    updateExistingItemInDB,
    addUserDefinedCategory,
    addUserDefinedItem,
    updateShoppingItemFields,
  };
};
