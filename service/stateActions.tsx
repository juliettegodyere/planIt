import { GuestUserInfo, UserInfo } from "./state";
import { ShoppingListAction } from "./store";
import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "./types";

  export const addItem = (item: ShoppingItemTypes): ShoppingListAction => ({
    type: "ADD_ITEM",
    payload: item,
  });

  export const updateItem = (key:string, item: ShoppingItemTypes) : ShoppingListAction=> ({
    type: "UPDATE_ITEM",
    payload: {key, item},
  });

  export const setCatalogItems = (items: CategoryItemResponseType[]): ShoppingListAction => ({
    type: 'SET_CATALOG_ITEMS',
    payload: items,
  });

  // export const addNewEntry = (item: ShoppingItem): ShoppingListAction => ({
  //   type: "ADD_NEW_ENTRY",
  //   payload: { item },
  // });

  // export const updateSelected = (key: string): ShoppingListAction => ({
  //   type: "UPDATE_SELECTED",
  //   payload: key ,
  // });
  
  // export const removeItem = (id) => ({
  //   type: "REMOVE_ITEM",
  //   payload: id,
  // });
  
  // export const updateQuantity = (
  //   key: string,
  //   quantity: number[]
  // ): ShoppingListAction => ({
  //   type: "UPDATE_QUANTITY",
  //   payload: { key, quantity:quantity},
  // });
  
  // export const updatePrice = (
  //   key: string, 
  //   price: string[]
  // ): ShoppingListAction => ({
  //   type: "UPDATE_PRICE",
  //   payload: { key, val: price },
  // });
  
  // export const updatePriority = (
  //   key: string, 
  //   priority: string[]
  // ): ShoppingListAction => ({
  //   type: "UPDATE_PRIORITY",
  //   payload: { key, val: priority },
  // });
  
  // export const updateUnit = (
  //   key: string, 
  //   unit: string[]
  // ): ShoppingListAction => ({
  //   type: "UPDATE_UNIT",
  //   payload: { key, val: unit },
  // });  

  // export const updatePurchase = (key:string) : ShoppingListAction=> ({
  //   type: "UPDATE_PURCHASE",
  //   payload:  key ,
  // });

  // export const setSearchQuery = (query: string) : ShoppingListAction => ({
  //   type: "SET_SEARCH_QUERY",
  //   payload: {query},
  // });
  
  // export const toggleFilter = () => ({
  //   type: "TOGGLE_FILTER",
  // });
  
  // export const toggleSelectionOrder = () => ({
  //   type: "TOGGLE_SELECTION_ORDER",
  // });
  
  // export const setSelectedCategory = (category: string) : ShoppingListAction => ({
  //   type: "SET_SELECTED_CATEGORY",
  //   payload: {category},
  // }); 

  export const setUser = (
    userInfo: UserInfo
  ): ShoppingListAction => ({
    type: "SET_USER",
    payload: userInfo ,
  });
  
  export const addGuestUser = (guestUserInfo: guestUserType): ShoppingListAction => ({
    type: "ADD_GUEST_USER",
    payload: guestUserInfo,  
  });

  export const updateGuestUser = (guestUserInfo: guestUserType): ShoppingListAction => ({
    type: "UPDATE_GUEST_USER",
    payload: guestUserInfo,  
  });

  export const setGuestUser = (guestUserInfo: guestUserType): ShoppingListAction => ({
    type: "SET_GUEST_USER",
    payload: guestUserInfo,  
  });


  // export const updateShoppingItems = (items: ShoppingItem[]): ShoppingListAction => ({
  //   type: "UPDATE_SHOPPING_ITEMS",
  //   payload: { items },
  // });

  // export const setInventoryItems = (items: ShoppingListItem[]): ShoppingListAction => ({
  //   type: 'SET_INVENTORY_ITEMS',
  //   payload: items,
  // });

  export const sethoppingItemsState = (items: ShoppingItemTypes[]): ShoppingListAction => ({
    type: 'SET_SHOPPING_ITEMS',
    payload: items,
  });

  export const setSelectedShoppingItemsHydrated = (val: boolean): ShoppingListAction => ({
    type: 'SET_SELECTED_ITEMS_HYDRATED',
    payload: val,
  });

  

  