// db/schema.ts or db/shoppingItems.ts

import { CategoryItemResponseType, CategoryItemTypes, CreateShoppingItemTypes, FullCategoryItem, ShoppingItemTypes, guestUserType } from '../service/types';
import * as SQLite from 'expo-sqlite';
import { generateSimpleUUID } from '@/Util/HelperFunction';
import { shoppingData } from '@/data/shoppingListData';

type GuestUserUpdateParams = Partial<guestUserType> & { id: string };

export const insertShoppingItem = async (db: SQLite.SQLiteDatabase, item: ShoppingItemTypes) => {
  try {
    await db.runAsync(
      `INSERT INTO shopping_items (
          id, key, name, category_item_id, quantity, qtyUnit, price, purchased, selected,
          createDate, modifiedDate, priority, note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        item.id,
        item.key,
        item.name,
        item.category_item_id,
        item.quantity,
        item.qtyUnit,
        item.price,
        Number(item.purchased),  // true → 1, false → 0
        Number(item.selected),   // true → 1, false → 0
        item.createDate,
        item.modifiedDate,
        item.priority,
        // newItem.category,
        item.note
      ]
    );
  } catch (error) {
    console.error("Failed to insert shopping item:", error);
    throw error; 
  }
  

  return {
    newItem:item
  };
};

export const updateShoppingItem = async (db: SQLite.SQLiteDatabase,item: ShoppingItemTypes) => {
  console.log("updateShoppingItem - On enter")
  console.log(item)
  const updatedItem = {
    ...item,
    purchased: item.purchased ? 1 : 0,
    selected: item.selected ? 1 : 0,
  };

  await db.runAsync(
    `UPDATE shopping_items
     SET category_item_id = ?, key = ?,name = ?, quantity = ?, qtyUnit = ?, price = ?, purchased = ?,
         selected = ?, createDate = ?, modifiedDate = ?, priority = ?
     WHERE id = ?;`,
    [
      updatedItem.category_item_id,
      updatedItem.key,
      updatedItem.name,
      updatedItem.quantity,
      updatedItem.qtyUnit,
      updatedItem.price,
      updatedItem.purchased,
      updatedItem.selected,
      updatedItem.createDate,
      updatedItem.modifiedDate,
      updatedItem.priority,
      // updatedItem.category,
      updatedItem.id,
      updatedItem.note
    ]
  );
  console.log("updateShoppingItem - Updated item")
  console.log(updatedItem)
  return {
    updatedItem
  };
};

export const insertCategory = async (db: SQLite.SQLiteDatabase,label: string, value: string) => {
  const id = await generateSimpleUUID(); 
  await db.runAsync(`
    INSERT INTO categories (id, label, value)
    VALUES (?, ?, ?);
  `, [id, label, value]);
};

export const getCategoryByValue = async (db: SQLite.SQLiteDatabase, value: string) => {
  const row = await db.getFirstAsync('SELECT * FROM categories WHERE value = ?', [value.toLocaleLowerCase()]) as CategoryItemTypes | undefined;

  if (!row) return null;

  return {
    id: row.id,
    value: row.value,
    label: row.label,
    category_id: row.id,
  };
};

export const insertCategoryItem = async (db: SQLite.SQLiteDatabase,label: string, value: string, categoryId: string) => {
  const id = await generateSimpleUUID(); 
  await db.runAsync(`
    INSERT INTO category_items (id, label, value, category_id)
    VALUES (?, ?, ?, ?);
  `, [id, label, value, categoryId]);
};

export const getAllShoppingItems = async (
  db: SQLite.SQLiteDatabase
): Promise<ShoppingItemTypes[]> => {
  const rawItems = await db.getAllAsync<ShoppingItemTypes>(
    `SELECT * FROM shopping_items`
  );
    console.log("getAllShoppingItems rawItems")
    console.log(rawItems)
  const items: ShoppingItemTypes[] = rawItems.map((item) => ({
    id: item.id,
    key: item.key,
    name: item.name,
    category_item_id: item.category_item_id,
    quantity: item.quantity,
    qtyUnit: item.qtyUnit,
    price: item.price,
    // purchased: item.purchased,
    // selected: item.selected,
    purchased: Boolean(item.purchased), // Convert 1 or 0 to true/false
    selected: Boolean(item.selected),
    createDate: item.createDate,
    modifiedDate: item.modifiedDate,
    priority: item.priority,
    note: item.note
  }));

  console.log("getAllShoppingItems items")
  console.log(items)

  return items;
};

export const getShoppingItemById = async (db: SQLite.SQLiteDatabase, id: string): Promise<ShoppingItemTypes | null> => {
  const row = await db.getFirstAsync('SELECT * FROM shopping_items WHERE id = ?', [id]) as ShoppingItemTypes | undefined;
  console.log("getShoppingItemById - row")
  console.log(row)
  if (!row) return null;

  return {
    id: row.id,
    key: row.key,
    name: row.name,
    category_item_id: row.category_item_id,
    quantity: row.quantity,
    qtyUnit: row.qtyUnit,
    price: row.price,
    purchased: String(row.purchased) === '1', // cast to boolean
    selected: String(row.selected) === '1',   // cast to boolean
    createDate: row.createDate,
    modifiedDate: row.modifiedDate,
    priority: row.priority,
    note: row.note
  };
};

export const getAllCatalogItems = async (db: SQLite.SQLiteDatabase): Promise<CategoryItemResponseType[]> => {
  try {
    // Flatten static items from JSON
    const staticItems: CategoryItemResponseType[] = shoppingData.categories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        category: category.label,
      }))
    );

    // Fetch user-defined items from DB
    const dbRows = await db.getAllAsync(`
      SELECT 
        ci.label AS label,
        ci.value AS value,
        c.label AS category
      FROM category_items ci
      JOIN categories c ON ci.category_id = c.id
    `);

    const dbItems: CategoryItemResponseType[] = (dbRows as any[]).map((row) => ({
      label: row.label,
      value: row.value,
      category: row.category,
    }));

    // Merge both arrays
    return [...staticItems, ...dbItems];
  } catch (error) {
    console.error('Error loading shopping items:', error);
    return [];
  }
};

export const insertGuestUser = async (
  db: SQLite.SQLiteDatabase
): Promise<guestUserType> => {
  const guestUser: guestUserType = {
    id: `guest-${Date.now()}`,
    name: "Guest",
    createdAt: new Date().toISOString(),
    country: "",
    currencyCode: "",
    currencySymbol: "",
  };

  await db.runAsync(
    `INSERT INTO guests (id, name, createdAt, country, currencyCode, currencySymbol)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      guestUser.id,
      guestUser.name,
      guestUser.createdAt,
      guestUser.country,
      guestUser.currencyCode,
      guestUser.currencySymbol,
    ]
  );

  return guestUser;
};

export const updateGuestUserDB = async (
  db: SQLite.SQLiteDatabase,
  guest: GuestUserUpdateParams
): Promise<guestUserType> => {
  console.log("updateGuestUserDB")
    console.log(guest)

  if (!guest.id) {
    console.log(guest.id)
    throw new Error("User ID is required for update");
  }

  await db.runAsync(
    `UPDATE guests
     SET country = ?, currencyCode = ?, currencySymbol = ?
     WHERE id = ?`,
    [guest.country ?? "", guest.currencyCode ?? "", guest.currencySymbol ?? "", guest.id]
  );

  const updatedUser = await db.getFirstAsync<guestUserType>(
    `SELECT * FROM guests WHERE id = ?`,
    [guest.id]
  );

  if (!updatedUser) {
    throw new Error(`User with ID ${guest.id} not found after update.`);
  }

  return updatedUser;
};

export const getGuestInfo = async (
  db: SQLite.SQLiteDatabase,
): Promise<guestUserType[]> => {

  const rawItems = await db.getAllAsync<guestUserType>(
    `SELECT * FROM guests ORDER BY createdAt DESC LIMIT 1`
  );

  const items: guestUserType[] = rawItems.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    country: item.country,
    currencyCode: item.currencyCode,
    currencySymbol: item.currencySymbol,
  }));

  return items;
}
export const deleteGuestUserDB = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> => {
  await db.runAsync(`DELETE FROM guests WHERE id = ?`, [id]);
};

export const getFullCategoryItems = async (
  db: SQLite.SQLiteDatabase
): Promise<FullCategoryItem[]> => {
  console.log("I got to getFullCategoryItems")
  const rows = await db.getAllAsync<{
    id: string;
    label: string;
    value: string;
    categoryLabel: string;
  }>(`
    SELECT 
      ci.id,
      ci.label,
      ci.value,
      c.label AS categoryLabel
    FROM category_items ci
    JOIN categories c ON ci.category_id = c.id;
  `);
  console.log("getFullCategoryItems rows")
  console.log(rows)
  return rows;
};





