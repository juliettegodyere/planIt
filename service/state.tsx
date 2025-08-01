// src/context/shoppingList/state.ts

import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "./types";

export interface AllItemsInitialStateType {
  guest: guestUserType | null;
  user: Record<string, any>;
  shoppingItemLists: ShoppingItemTypes[];
  searchQuery: string;
  filterVisible: boolean;
  isToggled: boolean;
  selectedCategory: string;
  catalogItems: CategoryItemResponseType[];
  isSelectedShoppingItemsHydrated:boolean;
  isGuestHydrated: boolean;
}

export type SelectedItemType = {
  id:string;
  key: string;
  name: string;
  quantity: string; 
  qtyUnit: string;
  price: string;
  purchased: boolean;
  selected: boolean;
  createDate: string;
  modifiedDate: string;
  priority: string;
  category: string;
  note: string,
  attachments:string;
  reminderDate: string
  reminderTime: string
  isReminderTimeEnabled: boolean;
  isReminderDateEnabled: boolean;
  earlyReminder: string;
  repeatReminder: string;
};

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
