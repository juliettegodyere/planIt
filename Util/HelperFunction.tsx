import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, isToday, isYesterday } from "date-fns";
import { useShoppingListContext } from "@/service/store";
import { useSQLiteContext } from "expo-sqlite";
import * as Crypto from 'expo-crypto';
import { ShoppingItemTypes } from "@/service/types";

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

export function useLocalStorageSync<T>(key: string, value: T) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // ⛔ Skip saving on first render
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return; // ✅ Skip saving if value is empty array or undefined
    }

    const saveToStorage = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        // console.log(`Saved ${key} to storage`);
      } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
      }
    };

    saveToStorage();
  }, [value, key]);
}

// export const updateLocalStorage = (items: ShoppingItem[]) => {
//   try {
//     AsyncStorage.setItem("@shoppingItems", JSON.stringify(items));
//     console.log("The update local storage was called");
//   } catch (e) {
//     console.error("Failed to update local storage:", e);
//   }
// };

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

// export function cleanUpItem(item: ShoppingItemTypes): ShoppingItemTypes {
//   let cleanedItem = { ...item };

//   while (cleanedItem.purchased.length > 0 && cleanedItem.purchased[cleanedItem.purchased.length - 1] === false) {
//     cleanedItem = {
//       ...cleanedItem,
//       purchased: cleanedItem.purchased.slice(0, -1),
//       quantity: cleanedItem.quantity.slice(0, -1),
//       price: cleanedItem.price.slice(0, -1),
//       priority: cleanedItem.priority.slice(0, -1),
//       selected: cleanedItem.selected.slice(0, -1),
//       modifiedDate: cleanedItem.modifiedDate.slice(0, -1),
//       createDate: cleanedItem.createDate.slice(0, -1),
//       qtyUnit: cleanedItem.qtyUnit.slice(0, -1),
//       key: cleanedItem.key,
//       name: cleanedItem.name,
//       category: cleanedItem.category,
//       id: cleanedItem.id,
     
//     };
//   }

//   return cleanedItem;
// }

// export const useLoadShoppingItems = (forceReload = false) => {
//   const {state, dispatch } = useShoppingListContext();
//   const {shoppingItems} = state;
//   const [loading, setLoading] = useState(false);
//   const db = useSQLiteContext();

//   useEffect(() => {
//     const load = async () => {
//       if (!shoppingItems || shoppingItems.length === 0 || forceReload) {
//         setLoading(true);
//         try {
//           const itemsFromDB: ShoppingItem[] = await loadUShoppingItemsFromDB(db);
//           dispatch(updateShoppingItems(itemsFromDB));
//         } catch (error) {
//           console.error("Failed to load shopping items:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     load();
//   }, [forceReload]);

//   return { shoppingItems, loading };
// };

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

export const useQuantityDebouncer = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = (callback: () => void, delay = 500) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(callback, delay);
  };

  return debounce;
};



