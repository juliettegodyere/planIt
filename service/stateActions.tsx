import { ShoppingListStateTypes, UserInfo } from "./state";
import { ShoppingListAction } from "./store";
import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "./types";

  export const addItem = (item: ShoppingListStateTypes): ShoppingListAction => ({
    type: "ADD_ITEM",
    payload: item,
  });

  // export const updateItem = (key:string, item: ShoppingListStateTypes) : ShoppingListAction=> ({
  //   type: "UPDATE_ITEM",
  //   payload: {key, item},
  // });

    export const updateItem = (
      id: string,
      updatedFields: Partial<ShoppingListStateTypes>
    ): ShoppingListAction => ({
      type: "UPDATE_ITEM",
      payload: { id, updatedFields },
    });

    

  export const setCatalogItems = (items: CategoryItemResponseType[]): ShoppingListAction => ({
    type: 'SET_CATALOG_ITEMS',
    payload: items,
  });

  export const updateCatalogItems = (items: CategoryItemResponseType[]): ShoppingListAction => ({
    type: 'UPDATE_CATALOG_ITEMS',
    payload: items,
  });

  export const removeItem = (id: string): ShoppingListAction => ({
    type: "DELETE_ITEM",
    payload: id,
  });

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

  export const setShoppingItemsState = (items: ShoppingListStateTypes[]): ShoppingListAction => ({
    type: 'SET_SHOPPING_ITEMS',
    payload: items,
  });

  export const setSelectedShoppingItemsHydrated = (val: boolean): ShoppingListAction => ({
    type: 'SET_SELECTED_ITEMS_HYDRATED',
    payload: val,
  });

  export const setGuestUserHydrated = (flag: boolean): ShoppingListAction => ({
    type: 'SET_GUEST_HYDRATED',
    payload: flag,
  });

  export const removeGuestUser = ():ShoppingListAction => ({
    type: 'REMOVE_GUEST_USER',
  });

  

  