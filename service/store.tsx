import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { shoppingListReducer } from "./reducer";
import { initialState,AllItemsInitialStateType, UserInfo, GuestUserInfo, ShoppingListStateTypes } from "./state";
import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "./types";

export type ShoppingListAction =
  | { type: "ADD_ITEM"; payload: ShoppingListStateTypes }
  | { type: "UPDATE_ITEM"; payload: {id: string, updatedFields:  Partial<ShoppingListStateTypes> }}
  | { type: "DELETE_ITEM"; payload: string}
  | { type: 'SET_CATALOG_ITEMS'; payload: CategoryItemResponseType[] }
  | { type: 'UPDATE_CATALOG_ITEMS'; payload: CategoryItemResponseType[] }
  | {type: 'SET_SHOPPING_ITEMS'; payload: ShoppingListStateTypes[]}
  | { type: "SET_USER"; payload:  UserInfo  }
  | { type: "SET_GUEST_USER"; payload: guestUserType } 
  | { type: "ADD_GUEST_USER"; payload: guestUserType } 
  | { type: "UPDATE_GUEST_USER"; payload: guestUserType } 
  | {type: "REMOVE_GUEST_USER"}
  | {type: "SET_SELECTED_ITEMS_HYDRATED"; payload:boolean}
  | {type: "SET_GUEST_HYDRATED"; payload:boolean}

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
