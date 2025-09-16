import { format, isToday, isYesterday } from "date-fns";
import * as Crypto from "expo-crypto";

import { CategoryItemResponseType, ReminderItemType, ShoppingItemTypes } from "@/service/types";
import { ShoppingListStateTypes } from "@/service/state";
import { useShoppingActions } from "@/db/Transactions";
import { Dispatch } from "react";
import { removeItem, updateItem } from "@/service/stateActions";
import { SQLiteDatabase } from "expo-sqlite";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
import { Alert, Platform } from "react-native";
type RepeatFrequency = "minute" | "hour" | "day" | "week";

/**
 * Update quantity of a shopping item.
 */
export const handleUpdateQuantity = async (
  change: number,
  selected: ShoppingListStateTypes,
  dispatch: Dispatch<any>,
  updateShoppingItemAndReturn: (entry: ShoppingItemTypes) => Promise<ShoppingItemTypes | undefined>,
) => {
  const lastQty = Number(selected.quantity ?? "0");
  const newQty = Math.max(1, lastQty + change);

  const updatedItem: ShoppingListStateTypes = {
    ...selected,
    quantity: String(newQty),
  };

  dispatch(updateItem(updatedItem.id, updatedItem));
  await updateShoppingItemAndReturn(updatedItem);
};

/**
 * Delete an existing shopping item.
 */
export const handleDeleteItem = async (
  id: string,
  item: CategoryItemResponseType,
  shoppingItemLists: ShoppingListStateTypes[],
  dispatch: Dispatch<any>,
  deleteShoppingItemAndReturn: (id: string) => Promise<ShoppingListStateTypes | undefined>
) => {
  const existingItem = shoppingItemLists.find(
    (i: ShoppingListStateTypes) => i.key === item.value && i.id === id
  );

  if (!existingItem) {
    console.warn("No existing item found for delete", id, item.value);
    return;
  }

  if (existingItem.selected) {
    console.log("Deleting selected item:", existingItem);

    const deletedItem = await deleteShoppingItemAndReturn(existingItem.id);

    if (deletedItem) {
      dispatch(removeItem(existingItem.id));
      console.log("Deleted item from DB and state:", deletedItem);
    }
  }
};

/**
 * Mark purchased as true and selected false.
 */
export const togglePurchased = async (
  selected: ShoppingListStateTypes,
  dispatch: Dispatch<any>,
  updateShoppingItemAndReturn: (entry: ShoppingItemTypes) => Promise<ShoppingItemTypes | undefined>,
  db: SQLiteDatabase,
  getReminderByItemId: (db: SQLiteDatabase, itemId: string) => Promise<ReminderItemType | null>,
  updateReminderFields: (db: SQLiteDatabase,reminderId: string,fields: Partial<ReminderItemType>) => Promise<void>,
  purchased: boolean
) => {
  let reminder: ReminderItemType | null = null; // ✅ initialize with null

  // ✅ Only fetch reminder if id exists
  if (selected?.reminder_id) {
    reminder = await getReminderByItemId(db, selected.reminder_id);

   // console.log("togglePurchased - reminder", reminder)

    if (reminder?.id) {
      // await updateReminderFields(db, reminder.id, {
      //   isReminderDateEnabled: false,
      //   isReminderTimeEnabled: false,
      // });
      if (purchased) {
        await updateReminderFields(db, reminder.id, {
          isReminderDateEnabled: false,
          isReminderTimeEnabled: false,
        });
      }
    }
  }

  // const s_item: ShoppingItemTypes = {
  //   ...selected,
  //   purchased: true,
  //   selected: false,
  // };
  const updatedPayload: ShoppingItemTypes = {
    ...selected,
    purchased,            // set based on flag
    selected: !purchased, // automatically invert selected
  };

  const updatedItem = await updateShoppingItemAndReturn(updatedPayload);

  if (updatedItem) {
    const updateItem_: ShoppingListStateTypes = {
      ...updatedItem,
      ...(reminder ? reminder : {}), // ✅ Only spread if reminder exists
      purchased: updatedItem.purchased,
      selected: updatedItem.selected,
      isReminderDateEnabled: reminder?.isReminderDateEnabled ?? false,
      isReminderTimeEnabled: reminder?.isReminderTimeEnabled ?? false,
      fired: updatedItem.purchased? false : reminder?.fired,
      notified: updatedItem.purchased? false : reminder?.notified,
    };

    dispatch(updateItem(updateItem_.id, updatedItem));
  }
};


export const formatDate = (input: string | Date) => {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isToday(date)) {
    return "Today";
  }
  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "EEEE, d MMM");
};

export const formatTime = (input?: string | Date | null) => {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  return format(date, "hh:mm a"); // 12-hour format, or "HH:mm" for 24-hour
};

export const generateSimpleUUID = async () => {
  // Create a unique string based on a timestamp and a random value
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2); // Random string for added uniqueness
  const inputString = timestamp + randomString;

  // Convert the input string to a Uint8Array (BufferSource)
  const encoder = new TextEncoder();
  const inputArray = encoder.encode(inputString);

  // Create a SHA512 digest of the input string (now passed as Uint8Array)
  const digestBuffer = await Crypto.digest(
    Crypto.CryptoDigestAlgorithm.SHA512,
    inputArray
  );

  // Convert the ArrayBuffer to a hexadecimal string
  const digestHex = Array.from(new Uint8Array(digestBuffer)) // Convert ArrayBuffer to an array of bytes
    .map((byte) => byte.toString(16).padStart(2, "0")) // Convert each byte to a 2-digit hex string
    .join(""); // Join all hex strings into a single string

  // Truncate the result to create a shorter ID (16 characters in this example)
  return digestHex.substring(0, 16);
};

export const getEarlyReminderOffsetMs = (earlyReminder: string): number => {
  switch (earlyReminder.toLowerCase()) {
    case "none":
    case "0 minutes":
      return 0;
    case "5 minutes before":
      return 5 * 60 * 1000;
    case "15 minutes before":
      return 15 * 60 * 1000;
    case "30 minutes before":
      return 30 * 60 * 1000;
    case "1 hour before":
      return 60 * 60 * 1000;
    case "1 day before":
      return 24 * 60 * 60 * 1000;
    case "2 days before":
      return 2 * 24 * 60 * 60 * 1000;
    case "1 week before":
      return 7 * 24 * 60 * 60 * 1000;
    case "2 weeks before":
      return 14 * 24 * 60 * 60 * 1000;
    case "1 month before":
      return 30 * 24 * 60 * 60 * 1000; // approximated as 30 days
    case "6 months before":
      return 6 * 30 * 24 * 60 * 60 * 1000; // approximated as 180 days
    default:
      return 0;
  }
};

export const getRepeatType = (
  repeatReminder: string
): RepeatFrequency | undefined => {
  switch (repeatReminder) {
    case "Minutely":
      return "minute";
    case "Hourly":
      return "hour";
    case "Daily":
      return "day";
    case "Weekly":
      return "week";
    default:
      return undefined;
  }
};

export function formatReminderDateTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return "";

  const date = new Date(dateStr);
  const time = new Date(timeStr);

  if (isNaN(date.getTime()) || isNaN(time.getTime())) return "";

  // Format time part "HH:mm"
  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let dayPart = format(date, "EEE d MMM yyyy"); // fallback

  if (isToday(date)) {
    dayPart = "Today";
  } else if (isYesterday(date)) {
    dayPart = "Yesterday";
  }

  return `${dayPart} ${formattedTime}`;
}

export const extractReminderFromItem = (
  item: ShoppingListStateTypes
): ReminderItemType => {
  const reminderItem = item as Partial<ReminderItemType>;

  return {
    item_id: reminderItem.item_id ?? item.id,
    date: reminderItem.date ?? null,
    time: reminderItem.time ?? null,
    isReminderDateEnabled: reminderItem.isReminderDateEnabled ?? false,
    isReminderTimeEnabled: reminderItem.isReminderTimeEnabled ?? false,
    title: reminderItem.title ?? "",
    body: reminderItem.body ?? "",
    earlyReminder:
      typeof reminderItem.earlyReminder === "string"
        ? reminderItem.earlyReminder
        : null,
    //repeat: typeof reminderItem.repeat === 'string' ? reminderItem.repeat : null,
    fired: reminderItem.fired ?? false,
    notificationId: reminderItem.notificationId ?? null,
  };
};

export function getNextRepeatDateTime(
  date: string,
  time: string,
  repeat: string
): string {
  //const current = new Date(`${date}T${time}`);
  const now = new Date();
  const dateObj = new Date(date);
  const originalTime = new Date(time);

  const reminderDateTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    originalTime.getHours(),
    originalTime.getMinutes(),
    originalTime.getSeconds(),
    originalTime.getMilliseconds()
  );

  switch (repeat) {
    case "Every Minute":
      reminderDateTime.setMinutes(reminderDateTime.getMinutes() + 1);
      break;
    case "Every Hour":
      reminderDateTime.setHours(reminderDateTime.getHours() + 1);
      break;
    case "Every Day":
      reminderDateTime.setDate(reminderDateTime.getDate() + 1);
      break;
    case "Every Week":
      reminderDateTime.setDate(reminderDateTime.getDate() + 7);
      break;
    case "Every Month":
      reminderDateTime.setMonth(reminderDateTime.getMonth() + 1);
      break;
    default:
      break;
  }

  return reminderDateTime.toISOString();
}

export const ensureNotificationPermission = async (): Promise<boolean> => {
  const { status, granted, canAskAgain } = await Notifications.getPermissionsAsync();

  console.log("status", status)
  console.log("granted", granted)
  console.log("canAskAgain", canAskAgain)

  if (granted) return true;

  if (canAskAgain) {
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  }

  // User has permanently denied (especially iOS)
  if (Platform.OS === "ios") {
    Alert.alert(
      "Notifications Disabled",
      "Please enable notifications in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  }

  return false;
};
