import React, { createContext, useContext, useReducer } from "react";
import { initialState } from "./state";

const ShoppingListContext = createContext();

const shoppingListReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        shoppingItems: [...state.shoppingItems, action.payload],
      };

    case "ADD_NEW_ENTRY":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((existingItem) =>
          existingItem.id === action.payload.item.id
            ? {
                ...existingItem,
                modifiedDate: [
                  ...existingItem.modifiedDate,
                  action.payload.item.modifiedDate,
                ],
                createDate: [
                  ...existingItem.createDate,
                  action.payload.item.createDate,
                ],
                price: [...existingItem.price, action.payload.item.price],
                purchased: [
                  ...existingItem.purchased,
                  action.payload.item.purchased,
                ],
                selected: [
                  ...existingItem.selected,
                  action.payload.item.selected,
                ],
                qtyUnit: [...existingItem.qtyUnit, action.payload.item.qtyUnit],
                quantity: [
                  ...existingItem.quantity,
                  action.payload.item.quantity,
                ],
                priority: [
                  ...existingItem.priority,
                  action.payload.item.priority,
                ],
              }
            : existingItem
        ),
      };
    case "UPDATE_SELECTED":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                selected: item.selected.map((p, index) =>
                  index === item.selected.length - 1 ? !p : p
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };
    case "UPDATE_PRIORITY":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                priority: item.priority.map((p, index) =>
                  index === item.selected.length - 1
                    ? action.payload.priority
                    : p
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };
    case "UPDATE_PURCHASE":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                purchased: item.purchased.map((p, index) =>
                  index === item.selected.length - 1 ? !p : p
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };
    case "UPDATE_UNIT":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                qtyUnit: item.qtyUnit.map((u, index) =>
                  index === item.selected.length - 1 ? action.payload.unit : u
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity.map((q, index) =>
                  index === item.selected.length - 1
                    ? Math.max(1, q + action.payload.change)
                    : q
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };

    case "UPDATE_PRICE":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                price: item.price.map((p, index) =>
                  index === item.selected.length - 1 ? action.payload.price : p
                ),
                modifiedDate: item.modifiedDate.map((d, index) =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d
                ),
              }
            : item
        ),
      };

    default:
      return state;
  }
};

export const ShoppingListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  return (
    <ShoppingListContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

// export const useShoppingListContext = () => useContext(ShoppingListContext);
// Custom Hook
export const useShoppingListContext = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error(
      "useShoppingListContext must be used within a ShoppingListProvider"
    );
  }
  return context;
};
