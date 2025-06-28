import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isToday, isYesterday } from "date-fns";
import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from 'expo-crypto';
import { CategoryItemResponseType, FullCategoryItem, ShoppingItemTypes } from "@/service/types";

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
  const digestBuffer = await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA512, inputArray);

  // Convert the ArrayBuffer to a hexadecimal string
  const digestHex = Array.from(new Uint8Array(digestBuffer)) // Convert ArrayBuffer to an array of bytes
    .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to a 2-digit hex string
    .join(''); // Join all hex strings into a single string

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
  // Map the shopping items
  return shoppingItems.map((shoppingItem) => {
    const categoryItem = categoryItemMap.get(shoppingItem.name);

    if (!categoryItem) {
      throw new Error(`No category item found for ID: ${shoppingItem.category_item_id}`);
    }

    return {
      label: categoryItem.label,
      value: categoryItem.value,
      category: categoryItem.label,
    };
  });
};

export function groupItemsByDate(items: CategoryItemResponseType[], itemMap: Record<string, ShoppingItemTypes>): {
  title: string;
  data: CategoryItemResponseType[];
}[] {
  const grouped: Record<string, CategoryItemResponseType[]> = {};

  items.forEach((item) => {
    const matched = itemMap[item.value]; // Map for faster lookup

    if (!matched) return;

    const dateKey = formatDate(matched.createDate);

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




