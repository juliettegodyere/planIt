import { ShoppingListState, ShoppingItem } from "./state";
import { ShoppingListAction } from "./store";

export const shoppingListReducer = (
  state: ShoppingListState,
  action: ShoppingListAction
): ShoppingListState => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        shoppingItems: [...state.shoppingItems, action.payload],
      };

    case "UPDATE_ITEM":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((existingItem) =>
          existingItem.key === action.payload.key
            ? action.payload.item
            : existingItem
        ),
      };

    case "ADD_NEW_ENTRY":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((existingItem) =>
          existingItem.key === action.payload.item.key
            ? {
                ...existingItem,
                modifiedDate: [
                  ...existingItem.modifiedDate,
                  action.payload.item.modifiedDate.at(-1)!,
                ],
                createDate: [
                  ...existingItem.createDate,
                  action.payload.item.createDate.at(-1)!,
                ],
                price: [
                  ...existingItem.price,
                  action.payload.item.price.at(-1)!,
                ],
                purchased: [
                  ...existingItem.purchased,
                  action.payload.item.purchased.at(-1)!,
                ],
                selected: [
                  ...existingItem.selected,
                  action.payload.item.selected.at(-1)!,
                ],
                qtyUnit: [
                  ...existingItem.qtyUnit,
                  action.payload.item.qtyUnit.at(-1)!,
                ],
                quantity: [
                  ...existingItem.quantity,
                  action.payload.item.quantity.at(-1)!,
                ],
                priority: [
                  ...existingItem.priority,
                  action.payload.item.priority.at(-1)!,
                ],
              }
            : existingItem
        ),
      };

    case "UPDATE_SELECTED":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.key === action.payload
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
          item.key === action.payload.key
            ? {
                ...item,
                priority: item.priority.map((p, index): string =>
                  index === item.selected.length - 1 &&
                  typeof action.payload.val === "string"
                    ? action.payload.val
                    : p ?? ""
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
          item.key === action.payload
            ? {
                ...item,
                purchased: item.purchased.map((p, index) =>
                  index === item.selected.length - 1 ? !p : p
                ),
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

    case "UPDATE_UNIT":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.key === action.payload.key
            ? {
                ...item,
                qtyUnit: item.qtyUnit.map((u, index): string =>
                  index === item.selected.length - 1 &&
                  typeof action.payload.val === "string"
                    ? action.payload.val
                    : u ?? ""
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
          item.key === action.payload.key
            ? {
                ...item,
                quantity: item.quantity.map((q, index): number =>
                  index === item.selected.length - 1 &&
                  typeof action.payload.quantity === "number"
                    ? Math.max(1, q + action.payload.quantity)
                    : q ?? 1
                ),
                modifiedDate: item.modifiedDate.map((d, index): string =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d ?? ""
                ),
              }
            : item
        ),
      };

    case "UPDATE_PRICE":
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((item) =>
          item.key === action.payload.key
            ? {
                ...item,

                price: item.price.map((p, index): string =>
                  index === item.price.length - 1 &&
                  typeof action.payload.val === "string"
                    ? action.payload.val
                    : p ?? ""
                ),
                modifiedDate: item.modifiedDate.map((d, index): string =>
                  index === item.selected.length - 1
                    ? new Date().toISOString()
                    : d ?? ""
                ),
              }
            : item
        ),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload.query };
    case "SET_GUEST_USER":
      return {
        ...state,
        guest: {
          ...action.payload,
        },
      };
    case "UPDATE_SHOPPING_ITEMS":
      return {
        ...state,
        shoppingItems: action.payload.items,
      };

    default:
      return state;
  }
};
