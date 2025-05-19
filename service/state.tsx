// src/context/shoppingList/state.ts

import { PriorityLevel } from "./PriorityLevel";

export interface ShoppingItem {
  id:string;
  key: string;
  name: string;
  quantity: number[];
  qtyUnit: string[];
  price: string[];
  purchased: boolean[];
  selected: boolean[]; // ✅ Ensure selected is an array
  createDate: string[];
  modifiedDate: string[];
  priority: string[];
  category:string;
}

export interface ShoppingListState {
  guest: Record<string, any>;
  user: Record<string, any>;
  shoppingItems: ShoppingItem[];
  searchQuery: string;
  filterVisible: boolean;
  isToggled: boolean;
  selectedCategory: string;
  inventoryItems: ShoppingListItem[];
  isSelectedShoppingItemsHydrated:boolean;
}

export const initialState: ShoppingListState = {
  guest: {},
  user: {},
  shoppingItems: [],
  searchQuery: "",
  filterVisible: false,
  isToggled: false,
  selectedCategory: "",
  inventoryItems: [],
  isSelectedShoppingItemsHydrated:false
};

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  country: string;
  currency: string;
  createdDate: string;
}

export interface GuestUserInfo {
  name: string;
  sessionId: string;
  country: string;
  currency: string;
  createdAt: string;
}

export interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}
