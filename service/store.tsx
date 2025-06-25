import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { shoppingListReducer } from "./reducer";
import { initialState,AllItemsInitialStateType, UserInfo, GuestUserInfo } from "./state";
import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "./types";

// Define action type
export type ShoppingListAction =
  | { type: "ADD_ITEM"; payload: ShoppingItemTypes }
  | { type: "UPDATE_ITEM"; payload: {key: string, item: ShoppingItemTypes }}
  | { type: 'SET_CATALOG_ITEMS'; payload: CategoryItemResponseType[] }
  // | { type: "ADD_NEW_ENTRY"; payload: { item: ShoppingItem } }
  // | { type: 'SET_INVENTORY_ITEMS'; payload: ShoppingListItem[] }
  | {type: 'SET_SHOPPING_ITEMS'; payload: ShoppingItemTypes[]}
  // | {
  //     type:
  //       | "UPDATE_PRIORITY"
  //       | "UPDATE_UNIT"
  //       // | "UPDATE_QUANTITY"
  //       | "UPDATE_PRICE";
  //     payload: {
  //       key: string;
  //       val:string[];
  //     };
  //   }
  // | {type: "UPDATE_QUANTITY"; payload: {key: string;quantity:number[]};}
  // | {type: "UPDATE_SELECTED"; payload: string}
  // | {type: "UPDATE_PURCHASE"; payload: string}
  | { type: "SET_USER"; payload:  UserInfo  }
  | { type: "SET_GUEST_USER"; payload: guestUserType } 
  | { type: "ADD_GUEST_USER"; payload: guestUserType } 
  | { type: "UPDATE_GUEST_USER"; payload: guestUserType } 
  // | { type: "SET_SELECTED_CATEGORY"; payload: { category: string }}
  // | { type: "SET_SEARCH_QUERY"; payload: {query:string} }
  | {type: "SET_SELECTED_ITEMS_HYDRATED"; payload:boolean}
  // | { type: "UPDATE_SHOPPING_ITEMS"; payload: { items: ShoppingItem[] } }; 

// Context type
interface ShoppingListContextType {
  state: AllItemsInitialStateType;
  dispatch: Dispatch<ShoppingListAction>;
}

// Create context with proper typing
const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

// Props type for the provider
interface ShoppingListProviderProps {
  children: ReactNode;
}

// Provider
export const ShoppingListProvider = ({
  children,
}: ShoppingListProviderProps) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  return (
    <ShoppingListContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

// Custom hook
export const useShoppingListContext = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingListContext must be used within a ShoppingListProvider"
    );
  }
  return context;
};
