// hooks/useShoppingItemActions.ts
import { useShoppingActions } from "@/db/context/useShoppingList";
import { ShoppingListItem, ShoppingItem } from "../service/state";
import { updateItem, addItem } from "../service/stateActions";
import { useShoppingListContext } from "@/service/store";

export const useShoppingItemActions = () => {
    const { state, dispatch } = useShoppingListContext();
    const {shoppingItems} = state
    const { addNewItemToDB, updateExistingItemInDB, updateShoppingItemFields } = useShoppingActions();

  const isChecked = (key: string) => {
    if (!shoppingItems || shoppingItems.length === 0) return false;
    const item = shoppingItems.find((item: ShoppingItem) => item.key === key);
    return item
      ? item.selected[item.selected.length - 1] &&
          !item.purchased[item.purchased.length - 1]
      : false;
  };

  const handleCheckboxChange = async (item: ShoppingListItem) => {
    const now = new Date().toISOString();
    const existingItem = shoppingItems.find((i) => i.key === item.value);

    if (existingItem) {
      const lastPurchased = existingItem.purchased?.at(-1) ?? false;
      const lastSelected = existingItem.selected?.at(-1) ?? false;

      if (!lastSelected) {
        if (lastPurchased) {
            const newEntry = {
                id: existingItem.id,
                key: item.value,
                name: item.label,
                category: item.category,
                modifiedDate: [now],
                createDate: [now],
                price: [""],
                purchased: [false],
                selected: [true],
                qtyUnit: ["None"],
                quantity: [1],
                priority: ["Low"],
                isSelectedShoppingItemsHydrated: true,
              };
          await updateExistingItemInDB(newEntry);
        } else {
          await updateShoppingItemFields(existingItem.id, { selected: [true] }, updateItem);
        }
      } else {
        await updateShoppingItemFields(existingItem.id, { selected: [true] }, updateItem);
      }
    } else {
        const newItem = {
            id: "",
            key: item.value,
            name: item.label,
            category: item.category,
            modifiedDate: [now],
            createDate: [now],
            price: [""],
            purchased: [false],
            selected: [true],
            qtyUnit: ["None"],
            quantity: [1],
            priority: ["Low"],
            isSelectedShoppingItemsHydrated: true,
          };
      await addNewItemToDB(newItem);
    }
  };

  return { isChecked, handleCheckboxChange };
};
