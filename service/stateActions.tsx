import { ShoppingItem, UserInfo, GuestUserInfo } from "./state";
import { ShoppingListAction } from "./store";

  export const addItem = (item: ShoppingItem): ShoppingListAction => ({
    type: "ADD_ITEM",
    payload: item,
  });

  export const updateItem = (key:string, item: ShoppingItem) : ShoppingListAction=> ({
    type: "UPDATE_ITEM",
    payload: {key, item},
  });

  export const addNewEntry = (item: ShoppingItem): ShoppingListAction => ({
    type: "ADD_NEW_ENTRY",
    payload: { item },
  });

  export const updateSelected = (key: string): ShoppingListAction => ({
    type: "UPDATE_SELECTED",
    payload: key ,
  });
  
  // export const removeItem = (id) => ({
  //   type: "REMOVE_ITEM",
  //   payload: id,
  // });
  
  export const updateQuantity = (
    key: string,
    quantity: number[]
  ): ShoppingListAction => ({
    type: "UPDATE_QUANTITY",
    payload: { key, quantity:quantity},
  });
  
  export const updatePrice = (
    key: string, 
    price: string[]
  ): ShoppingListAction => ({
    type: "UPDATE_PRICE",
    payload: { key, val: price },
  });
  
  export const updatePriority = (
    key: string, 
    priority: string[]
  ): ShoppingListAction => ({
    type: "UPDATE_PRIORITY",
    payload: { key, val: priority },
  });
  
  export const updateUnit = (
    key: string, 
    unit: string[]
  ): ShoppingListAction => ({
    type: "UPDATE_UNIT",
    payload: { key, val: unit },
  });  

  export const updatePurchase = (key:string) : ShoppingListAction=> ({
    type: "UPDATE_PURCHASE",
    payload:  key ,
  });

  export const setSearchQuery = (query: string) : ShoppingListAction => ({
    type: "SET_SEARCH_QUERY",
    payload: {query},
  });
  
  export const toggleFilter = () => ({
    type: "TOGGLE_FILTER",
  });
  
  export const toggleSelectionOrder = () => ({
    type: "TOGGLE_SELECTION_ORDER",
  });
  
  export const setSelectedCategory = (category: string) : ShoppingListAction => ({
    type: "SET_SELECTED_CATEGORY",
    payload: {category},
  }); 

  export const setUser = (
    userInfo: UserInfo
  ): ShoppingListAction => ({
    type: "SET_USER",
    payload: userInfo ,
  });
  
  export const setGuestUser = (guestUserInfo: GuestUserInfo): ShoppingListAction => ({
    type: "SET_GUEST_USER",
    payload: guestUserInfo,  
  });

  export const updateShoppingItems = (items: ShoppingItem[]): ShoppingListAction => ({
    type: "UPDATE_SHOPPING_ITEMS",
    payload: { items },
  });

  