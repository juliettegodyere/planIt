import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import {ShoppingListProvider, useShoppingListContext} from '../service/store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGuestUser, setSelectedShoppingItemsHydrated, setSelectedShoppingItemsItems, setUser } from '@/service/stateActions';
import { useRouter } from 'expo-router';
import { useLocalStorageSync } from '@/Util/HelperFunction';
import { createTables } from '@/db/schema';
import { getSelectedItemsFromSQLite } from '@/db/shoppingItems';
import { ShoppingItem } from '@/service/state';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  return (
    <GluestackUIProvider>
    <SQLiteProvider databaseName="shopping.db" onInit={createTables} >
      <ShoppingListProvider>
        <RootLayoutInner loading={loading} setLoading={setLoading} router={router} />
      </ShoppingListProvider>
    </SQLiteProvider>
  </GluestackUIProvider>  
  );
}

type RootLayoutInnerProps = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  router: ReturnType<typeof useRouter>;
};

function RootLayoutInner({ loading, setLoading, router }: RootLayoutInnerProps) {
  const {state, dispatch } = useShoppingListContext();
  const {shoppingItems, isSelectedShoppingItemsHydrated} = state
  const db = useSQLiteContext();

  //Rehydate the local storage always
  useLocalStorageSync("@shoppingItems", shoppingItems);

  const fetchItemsIfNeeded = async () => {
    if (!isSelectedShoppingItemsHydrated) {
      const items: ShoppingItem[] = await getSelectedItemsFromSQLite(db);
      dispatch(setSelectedShoppingItemsItems(items));
      dispatch(setSelectedShoppingItemsHydrated(true));
    }
  };

  useEffect(() => {

    const restoreSession = async () => {
    
      try {
        //await AsyncStorage.removeItem('@guestUser')
        
        const guestUserData = await AsyncStorage.getItem('@guestUser');
        const userData = await AsyncStorage.getItem('@guser');
        if (userData) {
          const user = JSON.parse(userData);
          dispatch(setUser(user)); 
          router.replace('/(tabs)');
        } else if (guestUserData) {
          const guest = JSON.parse(guestUserData);
          dispatch(setGuestUser(guest)); 
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)' as any); 
        }
        if(userData || guestUserData){
          fetchItemsIfNeeded()
        }    
      } catch (error) {
        console.error('Failed to restore session:', error);
        router.replace('/(auth)' as any);
      } finally {
        setLoading(false);
      }


    };

    restoreSession();
  }, []);
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, title: 'Login' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}


