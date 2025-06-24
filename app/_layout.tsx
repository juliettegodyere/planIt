import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import {ShoppingListProvider, useShoppingListContext} from '../service/store'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGuestUser, setSelectedShoppingItemsHydrated, sethoppingItemsState, setUser } from '@/service/stateActions';
import { useRouter } from 'expo-router';
import { useLocalStorageSync } from '@/Util/HelperFunction';
import { createTables } from '@/db/schema';
import { getAllShoppingItems } from '@/db/EntityManager';
import { ShoppingItemTypes } from '@/service/types';

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
  const {shoppingItemLists, isSelectedShoppingItemsHydrated, guest} = state
  const db = useSQLiteContext();

  const fetchItemsIfNeeded = async () => {
    if (!isSelectedShoppingItemsHydrated) {
      const items: ShoppingItemTypes[] = await getAllShoppingItems(db);
      dispatch(sethoppingItemsState(items));
      dispatch(setSelectedShoppingItemsHydrated(true));
    }
  };

  useEffect(() => {
    fetchItemsIfNeeded();
  }, []);
  useEffect(() => {
    console.log(guest)
    const restoreSession = async () => {
    
      try {
        if (guest && guest.id && guest.country) {
          router.replace('/(tabs)');
        } 
      } catch (error) {
        console.error('Login failed:', error);
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


