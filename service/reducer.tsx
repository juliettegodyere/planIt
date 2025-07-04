import { AllItemsInitialStateType, initialState } from "./state";
import { ShoppingListAction } from "./store";

export const shoppingListReducer = (
  state: AllItemsInitialStateType,
  action: ShoppingListAction
): AllItemsInitialStateType => {
  switch (action.type) {
    case "SET_CATALOG_ITEMS":
      return {
        ...state,
        catalogItems: action.payload,
      };
    case "ADD_ITEM":
      return {
        ...state,
        shoppingItemLists: [...state.shoppingItemLists, action.payload],
      };

    case "UPDATE_ITEM":
      return {
        ...state,
        shoppingItemLists: state.shoppingItemLists.map((existingItem) =>
          existingItem.id === action.payload.key
            ? action.payload.item
            : existingItem
        ),
      };

    case "SET_SHOPPING_ITEMS":
      const mergedItems = [...state.shoppingItemLists, ...action.payload];

      const uniqueItems = mergedItems.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id) // or item.key
      );

      return {
        ...state,
        shoppingItemLists: uniqueItems,
        isSelectedShoppingItemsHydrated:true
      };
    case "ADD_GUEST_USER":
      return {
        ...state,
        guest: {
          ...action.payload,
        },
      };

    case "UPDATE_GUEST_USER":
      return {
        ...state,
        guest: {
          ...state.guest,
          ...action.payload, // Only update country/currency or any subset
        },
      };
    case "SET_GUEST_USER":
      return {
        ...state,
        guest: action.payload,
        isGuestHydrated: true,
       };

    case "REMOVE_GUEST_USER":
      return {
         ...state,
        guest: null,
      };

    case "SET_SELECTED_ITEMS_HYDRATED":
      return {
        ...state,
        isSelectedShoppingItemsHydrated: action.payload,
      };
    case "SET_GUEST_HYDRATED":
      return {
        ...state,
        isGuestHydrated: action.payload,
      };

    default:
      return state;
  }
};
