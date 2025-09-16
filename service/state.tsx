// src/context/shoppingList/state.ts

import { CategoryItemResponseType, ReminderItemType, ShoppingItemTypes, guestUserType } from "./types";

//export type ShoppingListStateTypes = ShoppingItemTypes & Partial<Omit<ReminderItemType, 'item_id'>>;
export type ShoppingListStateTypes = ShoppingItemTypes & {
  reminder_id?: string; // store reminder ID separately
} & Partial<Omit<ReminderItemType, 'item_id' | 'id'>>;

export interface AllItemsInitialStateType {
  guest: guestUserType | null;
  user: Record<string, any>;
  shoppingItemLists: ShoppingListStateTypes[];
  searchQuery: string;
  filterVisible: boolean;
  isToggled: boolean;
  selectedCategory: string;
  catalogItems: CategoryItemResponseType[];
  isSelectedShoppingItemsHydrated:boolean;
  isGuestHydrated: boolean;
}

export const initialState: AllItemsInitialStateType = {
  guest: null,
  user: {},
  shoppingItemLists: [],
  searchQuery: "",
  filterVisible: false,
  isToggled: false,
  selectedCategory: "",
  catalogItems: [],
  isSelectedShoppingItemsHydrated:false,
  isGuestHydrated:false
};

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  countryName: string;
  currencyCode: string;
  createdDate: string;
}

export interface GuestUserInfo {
  name: string;
  sessionId: string;
  countryName: string;
  currencyCode: string;
  createdAt: string;
}