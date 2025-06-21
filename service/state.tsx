// src/context/shoppingList/state.ts

import { CategoryItemResponseType, ShoppingItemTypes } from "./types";

export interface AllItemsInitialStateType {
  guest: Record<string, any>;
  user: Record<string, any>;
  shoppingItemLists: ShoppingItemTypes[];
  searchQuery: string;
  filterVisible: boolean;
  isToggled: boolean;
  selectedCategory: string;
  catalogItems: CategoryItemResponseType[];
  isSelectedShoppingItemsHydrated:boolean;
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
  note: string
};

export const initialState: AllItemsInitialStateType = {
  guest: {},
  user: {},
  shoppingItemLists: [],
  searchQuery: "",
  filterVisible: false,
  isToggled: false,
  selectedCategory: "",
  catalogItems: [],
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
