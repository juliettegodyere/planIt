import { DEFAULTS } from "@/Util/constants/defaults";
import { getCategoryByValue } from "@/db/EntityManager";
import { useShoppingActions } from "@/db/Transactions";
import { ShoppingListStateTypes } from "@/service/state";
import { removeItem } from "@/service/stateActions";
import { useShoppingListContext } from "@/service/store";
import { CategoryItemResponseType } from "@/service/types";
import { useState } from "react";
  
export const useShoppingItemActions = (db: any) => {
  const { state, dispatch } = useShoppingListContext();
  const [isCreating, setIsCreating] = useState(false);
  const {
    addNewItemToShoppingItems,
    deleteShoppingItemAndReturn,
  } = useShoppingActions();

  const createOrToggleShoppingItem = async (item: CategoryItemResponseType) => {
    if (isCreating) return; // prevent double clicks
    setIsCreating(true);

    try {
      const now = new Date().toISOString();

      const existingCategory = await getCategoryByValue(db, item.category);

      const sameKeyItems = state.shoppingItemLists.filter(
        (i: ShoppingListStateTypes) => i.key === item.value
      );

      const activeItem = sameKeyItems.find(
        (i) => i.selected === true && i.purchased === false
      );

      if (activeItem) {
        // If active record exists → remove it
        await deleteShoppingItemAndReturn?.(activeItem.id);
        dispatch(removeItem(activeItem.id));
        return;
      }

      // Otherwise create a new record
      const newItem: ShoppingListStateTypes = {
        id: "",
        key: item.value,
        name: item.label,
        category_item_id: existingCategory?.category_id || "uncategorized",
        modifiedDate: now,
        createDate: now,
        price: DEFAULTS.PRICE,
        purchased: false,
        selected: true,
        qtyUnit: DEFAULTS.QTY_UNIT,
        quantity: DEFAULTS.QUANTITY,
        priority: DEFAULTS.PRIORITY,
        note: DEFAULTS.EMPTY,
        attachments: "[]",
      };

      const addedItem = await addNewItemToShoppingItems(newItem);

      if (addedItem) {
        dispatch({ type: "ADD_ITEM", payload: addedItem });
      } else {
        console.error("Failed to create shopping item");
      }
    } catch (error) {
      console.error("Error creating shopping item:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return { createOrToggleShoppingItem, isCreating };
};
