// db/schema.ts or db/shoppingItems.ts

import {
  CategoryItemResponseType,
  CategoryItemTypes,
  FullCategoryItem,
  ReminderItemType,
  ShoppingItemTypes,
  createUserType,
  guestUserType,
} from "../service/types";
import * as SQLite from "expo-sqlite";
import {
  generateSimpleUUID,
  getEarlyReminderOffsetMs,
} from "@/Util/HelperFunction";
import { shoppingData } from "@/data/shoppingListData";
import * as Notifications from "expo-notifications";

type GuestUserUpdateParams = Partial<guestUserType> & { id: string };

export const insertShoppingItem = async (
  db: SQLite.SQLiteDatabase,
  item: ShoppingItemTypes
) => {
  try {
    await db.runAsync(
      `INSERT INTO shopping_items (
        id, key, name, category_item_id, quantity, qtyUnit, price, purchased, selected,
        createDate, modifiedDate, priority, note, attachments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        item.id,
        item.key,
        item.name,
        item.category_item_id,
        item.quantity,
        item.qtyUnit,
        item.price,
        Number(item.purchased),
        Number(item.selected),
        item.createDate,
        item.modifiedDate,
        item.priority,
        item.note,
        item.attachments, // Make sure it's a stringified JSON
      ]
    );
  } catch (error) {
    console.error("Failed to insert shopping item:", error);
    throw error;
  }

  return {
    newItem: item,
  };
};

export const updateShoppingItem = async (
  db: SQLite.SQLiteDatabase,
  item: ShoppingItemTypes
) => {
  const updatedItem = {
    ...item,
    purchased: item.purchased ? 1 : 0,
    selected: item.selected ? 1 : 0,
  };

  await db.runAsync(
    `UPDATE shopping_items
     SET category_item_id = ?, key = ?, name = ?, quantity = ?, qtyUnit = ?, price = ?, purchased = ?,
         selected = ?, createDate = ?, modifiedDate = ?, priority = ?, note = ?,
         attachments = ? WHERE id = ?;`,
    [
      updatedItem.category_item_id,
      updatedItem.key,
      updatedItem.name,
      updatedItem.quantity,
      updatedItem.qtyUnit,
      updatedItem.price,
      Number(updatedItem.purchased),
      Number(updatedItem.selected),
      updatedItem.createDate,
      updatedItem.modifiedDate,
      updatedItem.priority,
      updatedItem.note,
      updatedItem.attachments,
      updatedItem.id,
    ]
  );
  return {
    updatedItem,
  };
};

export const deleteShoppingItem = async (
  db: SQLite.SQLiteDatabase,
  id: string
) => {
  await db.runAsync(`DELETE FROM shopping_items WHERE id = ?;`, [id]);
};

export const insertCategory = async (
  db: SQLite.SQLiteDatabase,
  label: string,
  value: string
): Promise<{ id: string; message: string }> => {
  const id = await generateSimpleUUID();
  await db.runAsync(
    `
    INSERT INTO categories (id, label, value)
    VALUES (?, ?, ?);
  `,
    [id, label, value]
  );

  return {
    id,
    message: "Category inserted successfully",
  };
};

export const getCategoryByValue = async (
  db: SQLite.SQLiteDatabase,
  value: string
) => {
  const row = (await db.getFirstAsync(
    "SELECT * FROM categories WHERE label = ?",
    [value]
  )) as CategoryItemTypes | undefined;

  if (!row) return null;

  return {
    id: row.id,
    value: row.value,
    label: row.label,
    category_id: row.id,
  };
};

export const getAllCategory = async (db: SQLite.SQLiteDatabase) => {
  const row = await db.getAllAsync<CategoryItemTypes>(
    `SELECT * FROM categories`
  );

  if (!row) return null;

  const categories: CategoryItemTypes[] = row.map((cat) => ({
    id: cat.id,
    value: cat.value,
    label: cat.label,
    category_id: cat.id,
  }));

  return categories;
};

export const insertCategoryItem = async (
  db: SQLite.SQLiteDatabase,
  label: string,
  value: string,
  categoryId: string
): Promise<CategoryItemResponseType> => {
  const id = await generateSimpleUUID();

  await db.runAsync(
    `
    INSERT INTO category_items (id, label, value, category_id)
    VALUES (?, ?, ?, ?);
  `,
    [id, label, value, categoryId]
  );

  const result = await db.getFirstAsync<{
    id: string;
    label: string;
    value: string;
    category_id: string;
  }>(
    `SELECT id, label, value, category_id FROM category_items WHERE id = ?;`,
    [id]
  );

  if (!result) {
    throw new Error("Failed to insert category item");
  }

  return {
    //id: result.id,
    label: result.label,
    value: result.value,
    category: result.category_id, // ✅ mapped to camelCase
  };
};

export const getAllShoppingItems = async (
  db: SQLite.SQLiteDatabase
): Promise<any[]> => {
  const rawItems = await db.getAllAsync<any>(
    `SELECT si.*, r.id as reminderId, r.title as reminderTitle, r.body as reminderBody,
            r.date as reminderDate, r.time as reminderTime, r.repeat as reminderRepeat,
            r.earlyReminder as reminderEarlyReminder, r.notificationId as reminderNotificationId,
            r.isReminderTimeEnabled, r.isReminderDateEnabled, r.fired
     FROM shopping_items si
     LEFT JOIN reminders r ON si.id = r.item_id`
  );

  const items = rawItems.map((item) => ({
    id: item.id,
    key: item.key,
    name: item.name,
    category_item_id: item.category_item_id,
    quantity: item.quantity,
    qtyUnit: item.qtyUnit,
    price: item.price,
    purchased: Boolean(item.purchased),
    selected: Boolean(item.selected),
    createDate: item.createDate,
    modifiedDate: item.modifiedDate,
    priority: item.priority,
    note: item.note,
    attachments: item.attachments,

    // Reminder fields flattened (will be null if no reminder exists)
    reminderId: item.reminderId ?? null,
    reminderTitle: item.reminderTitle ?? null,
    reminderBody: item.reminderBody ?? null,
    reminderDate: item.reminderDate ?? null,
    reminderTime: item.reminderTime ?? null,
    reminderRepeat: item.reminderRepeat ?? null,
    reminderEarlyReminder: item.reminderEarlyReminder ?? null,
    reminderNotificationId: item.reminderNotificationId ?? null,
    isReminderTimeEnabled:
      item.isReminderTimeEnabled != null
        ? Boolean(item.isReminderTimeEnabled)
        : null,
    isReminderDateEnabled:
      item.isReminderDateEnabled != null
        ? Boolean(item.isReminderDateEnabled)
        : null,
    fired: item.fired != null ? Boolean(item.fired) : null,
  }));

  return items;
};

export const getShoppingItemById = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<ShoppingItemTypes | null> => {
  const row = (await db.getFirstAsync(
    "SELECT * FROM shopping_items WHERE id = ?",
    [id]
  )) as ShoppingItemTypes | undefined;

  if (!row) return null;

  return {
    id: row.id,
    key: row.key,
    name: row.name,
    category_item_id: row.category_item_id,
    quantity: row.quantity,
    qtyUnit: row.qtyUnit,
    price: row.price,
    purchased: String(row.purchased) === "1",
    selected: String(row.selected) === "1",
    createDate: row.createDate,
    modifiedDate: row.modifiedDate,
    priority: row.priority,
    note: row.note,
    attachments: row.attachments,
  };
};

export const getAllCatalogItems = async (
  db: SQLite.SQLiteDatabase,
): Promise<CategoryItemResponseType[]> => {
  if (!db || !db.getAllAsync) {
    console.error("DB is not available or was closed.");
    return [];
  }
  try {
    // Flatten static items from JSON
    const staticItems: CategoryItemResponseType[] =
      shoppingData.categories.flatMap((category) =>
        category.items.map((item) => ({
          ...item,
          category: category.label,
        }))
      );

    //Fetch user-defined items from DB
    const dbRows = await db.getAllAsync(`
      SELECT 
        ci.label AS label,
        ci.value AS value,
        c.label AS category
      FROM category_items ci
      JOIN categories c ON ci.category_id = c.id
    `);

    const dbItems: CategoryItemResponseType[] = (dbRows as any[]).map(
      (row) => ({
        label: row.label,
        value: row.value,
        category: row.category,
      })
    );

    // Merge both arrays
    return [...staticItems, ...dbItems];
  } catch (error) {
    console.error("Error loading shopping items:", error);
    return [];
  }
};

export const insertGuestUser = async (
  db: SQLite.SQLiteDatabase,
  user: createUserType
): Promise<guestUserType> => {
  const guestUser: guestUserType = {
    id: `guest-${Date.now()}`,
    name: "Guest",
    createdAt: new Date().toISOString(),
    countryName: user.countryName,
    currencyCode: user.currencyCode,
    currencySymbol: user.currencySymbol,
  };

  await db.runAsync(
    `INSERT INTO guests (id, name, createdAt, countryName, currencyCode, currencySymbol)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      guestUser.id,
      guestUser.name,
      guestUser.createdAt,
      guestUser.countryName,
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
  if (!guest.id) {
    throw new Error("User ID is required for update");
  }

  await db.runAsync(
    `UPDATE guests
     SET countryName = ?, currencyCode = ?, currencySymbol = ?
     WHERE id = ?`,
    [
      guest.countryName ?? "",
      guest.currencyCode ?? "",
      guest.currencySymbol ?? "",
      guest.id,
    ]
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
  db: SQLite.SQLiteDatabase
): Promise<guestUserType[]> => {
  const rawItems = await db.getAllAsync<guestUserType>(
    `SELECT * FROM guests ORDER BY createdAt DESC LIMIT 1`
  );

  const items: guestUserType[] = rawItems.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.createdAt,
    countryName: item.countryName,
    currencyCode: item.currencyCode,
    currencySymbol: item.currencySymbol,
  }));

  return items;
};
export const deleteGuestUserDB = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> => {
  await db.runAsync(`DELETE FROM guests WHERE id = ?`, [id]);
};

export const getFullCategoryItems = async (
  db: SQLite.SQLiteDatabase
): Promise<FullCategoryItem[]> => {
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
  return rows;
};

export const getReminderById = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<ReminderItemType> => {
  const rows = await db.getAllAsync<ReminderItemType>(
    `SELECT * FROM reminders WHERE id = ?`,
    [id]
  );
  return rows[0];
};

// Function to update fired status
export const markReminderAsFired = async (
  db: SQLite.SQLiteDatabase,
  id: string
) => {
  await db.runAsync(`UPDATE reminders SET fired = 1 WHERE id = ?`, [id]);
};

export const deleteReminder = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> => {
  await db.runAsync(`DELETE FROM reminders WHERE id = ?;`, [id]);
};

// export const getAllReminders = async (
//   db: SQLite.SQLiteDatabase
// ): Promise<ReminderItemType[]> => {
//   const rows = await db.getAllAsync<ReminderItemType>(`
//     SELECT * FROM reminders;
//   `);
//   return rows;
// };

export const getAllReminders = async (
  db: SQLite.SQLiteDatabase
): Promise<ReminderItemType[]> => {
  const rows = await db.getAllAsync<ReminderItemType>(`
    SELECT r.* 
    FROM reminders r
    INNER JOIN shopping_items s ON r.item_id = s.id
    WHERE s.purchased = 0;
  `);
  return rows;
};

export const getReminderByItemId = async (
  db: SQLite.SQLiteDatabase,
  itemId: string
): Promise<ReminderItemType | null> => {
  const rows = await db.getAllAsync<ReminderItemType>(
    `SELECT * FROM reminders WHERE item_id = ? LIMIT 1;`,
    [itemId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateReminderNotificationId = async (
  db: SQLite.SQLiteDatabase,
  reminderId: string,
  notificationId: string
): Promise<void> => {
  if (!db || !reminderId || !notificationId) {
    console.warn("Missing required parameters for updating reminder");
    return;
  }

  try {
    await db.runAsync(`UPDATE reminders SET notificationId = ? WHERE id = ?`, [
      notificationId,
      reminderId,
    ]);
  } catch (error) {
    console.error("Failed to update notificationId in reminders table:", error);
    throw error;
  }
};

export const updateReminderFields = async (
  db: SQLite.SQLiteDatabase,
  reminderId: string,
  fields: Partial<ReminderItemType>
): Promise<void> => {
  const keys = Object.keys(fields);

  if (keys.length === 0) return; // nothing to update

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => (fields as any)[key]);

  await db.runAsync(`UPDATE reminders SET ${setClause} WHERE id = ?;`, [
    ...values,
    reminderId,
  ]);
};

export const deleteReminderByShoppingItem = async (
  db: SQLite.SQLiteDatabase,
  item_id: string
) => {
  await db.runAsync(`DELETE FROM reminders WHERE item_id = ?;`, [item_id]);
};

export const saveReminder = async (
  db: SQLite.SQLiteDatabase,
  reminder: ReminderItemType
): Promise<ReminderItemType> => {
  let id = reminder.id ?? (await generateSimpleUUID());

  const oldResults = await getReminderById(db, id);

  // Step 2: Save (insert or replace) the new reminder
  await db.runAsync(
    `
    INSERT OR REPLACE INTO reminders 
    (id, item_id, title, body, date, time, earlyReminder, notificationId, isReminderTimeEnabled, isReminderDateEnabled, fired, notified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      id,
      reminder.item_id,
      reminder.title ?? null,
      reminder.body ?? null,
      reminder.date ?? null,
      reminder.time ?? null,
      // reminder.repeat ?? 'none',
      reminder.earlyReminder ?? null,
      reminder.notificationId ?? null,
      reminder.isReminderTimeEnabled ? 1 : 0,
      reminder.isReminderDateEnabled ? 1 : 0,
      reminder.fired ? 1 : 0,
      reminder.notified ? 1 : 0,
    ]
  );

  let savedReminder = await getReminderById(db, id);

  if (!savedReminder) {
    throw new Error(`Reminder with id ${id} not found after save.`);
  }

  if (savedReminder.date && savedReminder.time) {
    const shouldSchedule =
      savedReminder.isReminderDateEnabled &&
      savedReminder.isReminderTimeEnabled;

    if (shouldSchedule) {
      const date = new Date(savedReminder.date);
      const time = new Date(savedReminder.time);

      const reminderDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
      );

      const now = new Date();

      // Extract old date/time
      const oldDate = oldResults?.date;
      const oldTime = oldResults?.time;
      const oldEarlyReminder = oldResults?.earlyReminder;
      //const oldRepeat = oldResults?.repeat;
      // Extract new date/time
      const newDate = savedReminder.date;
      const newTime = savedReminder.time;
      const newEarlyReminder = savedReminder.earlyReminder;
      //const newRepeat= savedReminder.repeat;

      // Check if date/time actually changed
      const dateTimeChanged =
        (oldDate &&
          newDate &&
          new Date(oldDate).getTime() !== new Date(newDate).getTime()) ||
        (oldTime &&
          newTime &&
          new Date(oldTime).getTime() !== new Date(newTime).getTime()) ||
        oldEarlyReminder !== newEarlyReminder;

      const isFuture = reminderDateTime.getTime() > Date.now();

      if (dateTimeChanged && isFuture) {
        // Subtract early reminder offset
        const offsetMs = getEarlyReminderOffsetMs(
          savedReminder.earlyReminder ?? "0 minutes"
        );
        const adjustedReminderTime = new Date(
          reminderDateTime.getTime() - offsetMs
        );

        // Ensure trigger time is in the future
        const finalTriggerTime =
          adjustedReminderTime > now ? adjustedReminderTime : reminderDateTime;


        const trigger: Notifications.DateTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: finalTriggerTime,
          //...(repeat ? { repeatFrequency: repeat } : {}),
        };

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: savedReminder.title ?? "Reminder",
            body: savedReminder.body ?? "",
            sound: true,
            data: {
              screen: "notification",
              id: savedReminder.id,
            },
          },
          trigger,
        });

        if (!savedReminder?.id) {
          throw new Error("Reminder ID is undefined");
        }

        // Update reminder with the notification ID
        await db.runAsync(
          `UPDATE reminders SET notificationId = ? WHERE id = ?`,
          [notificationId, savedReminder.id]
        );

        // Fetch updated reminder again
        savedReminder = await getReminderById(db, id);
      } else {
        // just update the database without scheduling
        console.log("No scheduling needed, updating DB only...");
      }
    } else {
      console.log(
        "Reminder not eligible for scheduling (disabled or purchased)."
      );
    }
  }

  return savedReminder;
};
