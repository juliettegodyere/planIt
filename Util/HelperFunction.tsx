import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isToday, isYesterday } from "date-fns";
import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from "expo-crypto";
import {
  CategoryItemResponseType,
  FullCategoryItem,
  ShoppingItemTypes,
} from "@/service/types";

// This function helps convert the currency label to the value
export const getCurrencyLabelByValue = (selectedCountry: string) => {
  const currencyLabelMap: { [key: string]: string } = {
    "£": "£-GBP - British Pound",
    CAD$: "CAD$ - CAD - Canada Dallar",
    NGN: "NGN - Nigerian Naira",
    US$: "US$ - USD - US Dollar",
  };

  return currencyLabelMap[selectedCountry] || "";
};

// This function helps get the currency from the country
export const getCurrencyByCountry = (selectedCountry: string) => {
  const countryCurrencyMap: { [key: string]: string } = {
    "United Kingdom": "£",
    Canada: "CAD$",
    Nigeria: "NGN",
    "United State": "US$",
  };

  return countryCurrencyMap[selectedCountry] || "";
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

export const transformToCategoryItemResponse = (
  shoppingItems: ShoppingItemTypes[],
  fullCategoryItems: CategoryItemResponseType[]
): CategoryItemResponseType[] => {
  // Build a lookup map for quick access
  const categoryItemMap = new Map<string, CategoryItemResponseType>();
  fullCategoryItems.forEach((item) => {
    categoryItemMap.set(item.label, item);
  });
  console.log("categoryItemMap")
  console.log(categoryItemMap)
  // Map the shopping items
  return shoppingItems.map((shoppingItem) => {
    const categoryItem = categoryItemMap.get(shoppingItem.name);

    if (!categoryItem) {
      throw new Error(
        `No category item found for name: ${shoppingItem.name}`
      );
    }

    // return {
    //   label: categoryItem.label,
    //   value: categoryItem.value,
    //   category: categoryItem.label,
    // };
    return {
      label: categoryItem.label,
      value: categoryItem.value + "-" + shoppingItem.id, // ensure uniqueness
      category: categoryItem.category || "Uncategorized", // fallback
      __originalItem__: shoppingItem, // attach full shopping item if needed
    };
  });
};

export function groupItemsByDate(
  items: CategoryItemResponseType[],
  itemMap: Record<string, ShoppingItemTypes>
): {
  title: string;
  data: CategoryItemResponseType[];
}[] {
  const grouped: Record<string, CategoryItemResponseType[]> = {};

  items.forEach((item) => {
    //const matched = itemMap[item.label]; // Map for faster lookup
    const shoppingItem = (item as any).__originalItem__ as ShoppingItemTypes;

    //if (!matched) return;
    if (!shoppingItem) return;

    //const dateKey = formatDate(matched.createDate);
    const dateKey = formatDate(shoppingItem.createDate);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(item);
  });

  return Object.entries(grouped).map(([title, data]) => ({
    title,
    data,
  }));
}

const getEarlyReminderOffsetMs = (earlyReminder: string): number => {
  switch (earlyReminder.toLowerCase()) {
    case "5 min before":
      return 5 * 60 * 1000;
    case "15 min before":
      return 15 * 60 * 1000;
    case "30 min before":
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

export const isReminderDue = (
  reminderDate: string,
  reminderTime: string,
  earlyReminder: string,
  repeatReminder: string // not handled yet
): boolean => {
  if (!reminderDate?.trim() || !reminderTime?.trim()) return false;

  const date = new Date(reminderDate);
  const time = new Date(reminderTime);

  if (isNaN(date.getTime()) || isNaN(time.getTime())) return false;

  // Combine date and time to get full reminder datetime
  const reminderDateTime = new Date(date);
  reminderDateTime.setHours(time.getHours());
  reminderDateTime.setMinutes(time.getMinutes());
  reminderDateTime.setSeconds(0);
  reminderDateTime.setMilliseconds(0);

  // Apply early reminder offset
  const offsetMs = getEarlyReminderOffsetMs(earlyReminder);
  const adjustedReminderTime = new Date(reminderDateTime.getTime() - offsetMs);

  const now = new Date();

  // Ignore immediate reminders
  if (
    date.toDateString() === now.toDateString() &&
    time.getHours() === now.getHours() &&
    time.getMinutes() === now.getMinutes()
  ) {
    return false;
  }

  // Is it due now?
  return now >= adjustedReminderTime;
};

export function formatReminderDateTime(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return '';

  const date = new Date(dateStr);
  const time = new Date(timeStr);

  if (isNaN(date.getTime()) || isNaN(time.getTime())) return '';

  // Format time part "HH:mm"
  const formattedTime = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let dayPart = format(date, 'EEE d MMM yyyy'); // fallback

  if (isToday(date)) {
    dayPart = 'Today';
  } else if (isYesterday(date)) {
    dayPart = 'Yesterday';
  }

  return `${dayPart} ${formattedTime}`;
}
