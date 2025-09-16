

import { updateGuestUser, setGuestUserHydrated } from "@/service/stateActions";
import { Href, useRouter } from "expo-router";
import { useShoppingListContext } from "@/service/store";
import { createUserType } from "@/service/types";
import { userTransactions } from "@/db/Transactions";



export function useGuestUser() {
    const { dispatch } = useShoppingListContext();
    const router = useRouter();
    const { addNewGuestUserToDB} =
    userTransactions();
  
    const handleSelect = async (country: createUserType, targetPage: Href) => {
      const updatedItem = await addNewGuestUserToDB(country);
  
      if (updatedItem) {
        dispatch(updateGuestUser(updatedItem));
        dispatch(setGuestUserHydrated(true));
        router.push(targetPage);
      }
    };
  
    return { handleSelect };
  }
  