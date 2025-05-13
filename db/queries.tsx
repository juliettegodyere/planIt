import {ShoppingItem} from '../service/state'
import {ShoppingItemDB, CategoryItemResponseType} from './types'
import {shoppingData} from '../data/shoppingListData'
import * as SQLite from 'expo-sqlite';

export const loadUShoppingItemsFromDB = async (db: SQLite.SQLiteDatabase) : Promise<ShoppingItem[]> => {
    const shoppingItems: ShoppingItem[] = [];
  
    try {
      // Fetch all rows from the shopping table
      const allRows = await db.getAllAsync('SELECT * FROM shopping_items');
      
      // Type assertion to let TypeScript know the row structure
      for (const row of allRows as ShoppingItemDB[]) {
        shoppingItems.push({
            id: row.id,
            key: row.key,
            name: row.name,
            quantity: JSON.parse(row.quantity),
            qtyUnit: JSON.parse(row.qtyUnit),
            price: JSON.parse(row.price),
            purchased: JSON.parse(row.purchased),
            selected: JSON.parse(row.selected),
            createDate: JSON.parse(row.createDate),
            modifiedDate: JSON.parse(row.modifiedDate),
            priority: JSON.parse(row.priority),
            category: row.category,
          });
      }
  
      return shoppingItems; // Return the array of items
    } catch (error) {
      console.error('Failed to load user-defined items from DB:', error);
      return [];
    }
  };

  export const getAllShoppingItems = async (db: SQLite.SQLiteDatabase,): Promise<CategoryItemResponseType[]> => {
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

  export const getShoppingItemById = async (db: SQLite.SQLiteDatabase, id: string): Promise<ShoppingItem | null> => {
    const row = await db.getFirstAsync('SELECT * FROM shopping_items WHERE id = ?', [id]) as ShoppingItemDB | undefined;
  
    if (!row) return null;
  
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      category: row.category,
      quantity: JSON.parse(row.quantity),
      qtyUnit: JSON.parse(row.qtyUnit),
      price: JSON.parse(row.price),
      purchased: JSON.parse(row.purchased),
      selected: JSON.parse(row.selected),
      createDate: JSON.parse(row.createDate),
      modifiedDate: JSON.parse(row.modifiedDate),
      priority: JSON.parse(row.priority),
    };
  };
  
  
  