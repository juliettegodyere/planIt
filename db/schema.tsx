import * as SQLite from "expo-sqlite";
import { categoryOptions } from "../data/dataStore";
import { generateSimpleUUID } from "../Util/HelperFunction";

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

       -- DROP TABLE IF EXISTS shopping_items; --
      -- DROP TABLE IF EXISTS catalog_items; -- 
      -- DROP TABLE IF EXISTS categories; -- 
       -- DROP TABLE IF EXISTS guests; -- 
    -- DROP TABLE IF EXISTS reminders;  --

      CREATE TABLE IF NOT EXISTS guests (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        countryName TEXT,
        currencyCode TEXT,
        currencySymbol TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        countryName TEXT,
        currencyCode TEXT,
        currencySymbol TEXT,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL UNIQUE
      );      

      CREATE TABLE IF NOT EXISTS category_items (
        id TEXT PRIMARY KEY NOT NULL,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        unit TEXT, -- optional: JSON array of available units
        category_id TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES categories(id),
        UNIQUE (value, category_id)
      );

      CREATE TABLE IF NOT EXISTS shopping_items (
        id TEXT PRIMARY KEY NOT NULL,
        key TEXT NOT NULL,
        name TEXT NOT NULL,
        category_item_id TEXT NOT NULL,
        quantity TEXT,
        qtyUnit TEXT,
        price TEXT,
        purchased INTEGER DEFAULT 0,
        selected INTEGER DEFAULT 0,
        createDate TEXT,
        modifiedDate TEXT,
        priority TEXT,
        note TEXT,
        attachments TEXT, -- JSON stringified array of AttachmentParam
        FOREIGN KEY (category_item_id) REFERENCES category_items(id)
      );  
      
      CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY NOT NULL,
      item_id TEXT NOT NULL UNIQUE, -- ensures one reminder per item
      title TEXT,
      body TEXT,
      date TEXT, -- ISO format recommended
      time TEXT, -- 24-hour format or combined as datetime
      repeat TEXT, -- e.g., 'none', 'daily', 'weekly'
      earlyReminder TEXT,
      notificationId TEXT,
      isReminderTimeEnabled INTEGER DEFAULT 0,
      isReminderDateEnabled INTEGER DEFAULT 0,
      fired INTEGER DEFAULT 0,
      notified INTEGER DEFAULT 0,
      FOREIGN KEY (item_id) REFERENCES shopping_items(id)
    );
    `);

    // Seed categories
    for (const category of categoryOptions) {
      const existing = await db.getFirstAsync(
        "SELECT * FROM categories WHERE value = ?",
        [category.value]
      );

      if (!existing) {
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

    console.log("Tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize tables:", error);
  }
};

// Next is to handle update
