import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import {categoryOptions} from '../data/dataStore'
import {generateSimpleUUID} from '../Util/HelperFunction'

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      DROP TABLE IF EXISTS shopping_items;
      CREATE TABLE IF NOT EXISTS shopping_items (
        id TEXT PRIMARY KEY NOT NULL,
        key TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity TEXT,
        qtyUnit TEXT,
        price TEXT,
        purchased TEXT,
        selected TEXT,
        createDate TEXT,
        modifiedDate TEXT,
        priority TEXT,
        category TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS category_items (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        category_id TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
      -- Delete all items from shopping_items table
      -- DELETE FROM shopping_items;
    `);
    for (const category of categoryOptions) {
      const existing = await db.getFirstAsync(
        "SELECT * FROM categories WHERE value = ?",
        [category.value]
      );

      if (!existing) {
         // Generate a unique ID using generateSimpleUUID function
         const id = await generateSimpleUUID(); 
        await db.runAsync(
          "INSERT INTO categories (id, label, value) VALUES (?, ?, ?)",
          [id, category.label, category.value]
        );
        console.log(`Inserted category: ${category.label}`);
      } else {
        console.log(`Category already exists: ${category.label}`);
      }
    }

    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize tables:', error);
  }
};

// Next is to handle update