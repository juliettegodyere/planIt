// db/schema.ts or db/shoppingItems.ts

import { ShoppingItem } from '@/service/state';
import { ShoppingItemDB } from './types';
import * as SQLite from 'expo-sqlite';
import { generateSimpleUUID } from '@/Util/HelperFunction';

export const insertShoppingItem = async (db: SQLite.SQLiteDatabase, item: Omit<ShoppingItem, 'id'>) => {
  const id = await generateSimpleUUID(); 
  
  const newItem: ShoppingItemDB = {
    ...item,
    id,
    key:item.key,
    name:item.name,
    quantity: JSON.stringify(item.quantity),
    qtyUnit: JSON.stringify(item.qtyUnit),
    price: JSON.stringify(item.price),
    purchased: JSON.stringify(item.purchased),
    selected: JSON.stringify(item.selected),
    createDate: JSON.stringify(item.createDate),
    modifiedDate: JSON.stringify(item.modifiedDate),
    priority: JSON.stringify(item.priority),
    category:item.category,
  };

  console.log(newItem)
  try {
    await db.runAsync(
      `INSERT INTO shopping_items (
          id, key, name, quantity, qtyUnit, price, purchased, selected,
          createDate, modifiedDate, priority, category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        newItem.id,
        newItem.key,
        newItem.name,
        newItem.quantity,
        newItem.qtyUnit,
        newItem.price,
        newItem.purchased,
        newItem.selected,
        newItem.createDate,
        newItem.modifiedDate,
        newItem.priority,
        newItem.category,
      ]
    );
  } catch (error) {
    console.error("Failed to insert shopping item:", error);
    throw error; // Re-throw if you want to handle it upstream
  }
  

  return {
    id: newItem.id,
    key:newItem.key,
    name: newItem.name,
    category: newItem.category,
    quantity: JSON.parse(newItem.quantity),
    qtyUnit: JSON.parse(newItem.qtyUnit),
    price: JSON.parse(newItem.price),
    purchased: JSON.parse(newItem.purchased),
    selected: JSON.parse(newItem.selected),
    createDate: JSON.parse(newItem.createDate),
    modifiedDate: JSON.parse(newItem.modifiedDate),
    priority: JSON.parse(newItem.priority),
  };
};

export const updateShoppingItem = async (db: SQLite.SQLiteDatabase,item: ShoppingItem) => {
  const updatedItem = {
    ...item,
    key:item.key,
    name:item.name,
    category:item.category,
    quantity: JSON.stringify(item.quantity),
    qtyUnit: JSON.stringify(item.qtyUnit),
    price: JSON.stringify(item.price),
    purchased: JSON.stringify(item.purchased),
    selected: JSON.stringify(item.selected),
    createDate: JSON.stringify(item.createDate),
    modifiedDate: JSON.stringify(item.modifiedDate),
    priority: JSON.stringify(item.priority),
  };

  await db.runAsync(
    `UPDATE shopping_items
     SET name = ?, key = ?, quantity = ?, qtyUnit = ?, price = ?, purchased = ?,
         selected = ?, createDate = ?, modifiedDate = ?, priority = ?, category = ?
     WHERE id = ?;`,
    [
      updatedItem.name,
      updatedItem.key,
      updatedItem.quantity,
      updatedItem.qtyUnit,
      updatedItem.price,
      updatedItem.purchased,
      updatedItem.selected,
      updatedItem.createDate,
      updatedItem.modifiedDate,
      updatedItem.priority,
      updatedItem.category,
      updatedItem.id,
    ]
  );

  return {
    id: updatedItem.id,
    key: updatedItem.key,
    name: updatedItem.name,
    quantity: JSON.parse(updatedItem.quantity),
    qtyUnit: JSON.parse(updatedItem.qtyUnit),
    price: JSON.parse(updatedItem.price),
    purchased: JSON.parse(updatedItem.purchased),
    selected: JSON.parse(updatedItem.selected),
    createDate: JSON.parse(updatedItem.createDate),
    modifiedDate: JSON.parse(updatedItem.modifiedDate),
    priority: JSON.parse(updatedItem.priority),
    category: updatedItem.category,
  };
};

export const insertCategory = async (db: SQLite.SQLiteDatabase,label: string, value: string) => {
  const id = await generateSimpleUUID(); 
  await db.runAsync(`
    INSERT INTO categories (id, label, value)
    VALUES (?, ?, ?);
  `, [id, label, value]);
};

export const insertCategoryItem = async (db: SQLite.SQLiteDatabase,label: string, value: string, categoryId: string) => {
  const id = await generateSimpleUUID(); 
  await db.runAsync(`
    INSERT INTO category_items (id, label, value, category_id)
    VALUES (?, ?, ?, ?);
  `, [id, label, value, categoryId]);
};

export const getSelectedItemsFromSQLite = async (
  db: SQLite.SQLiteDatabase
): Promise<ShoppingItem[]> => {
  const rawItems = await db.getAllAsync<ShoppingItemDB>(
    `SELECT * FROM shopping_items'`
  );

  const items: ShoppingItem[] = rawItems.map((item) => ({
    id: item.id,
    key: item.key,
    name: item.name,
    category: item.category,
    quantity: JSON.parse(item.quantity),
    qtyUnit: JSON.parse(item.qtyUnit),
    price: JSON.parse(item.price),
    purchased: JSON.parse(item.purchased),
    selected: JSON.parse(item.selected),
    createDate: JSON.parse(item.createDate),
    modifiedDate: JSON.parse(item.modifiedDate),
    priority: JSON.parse(item.priority),
  }));

  return items;
};




