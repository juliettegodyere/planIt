import React, {Dispatch, SetStateAction, useEffect, useState} from 'react'
import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import {ShoppingListProvider, useShoppingListContext} from '../service/store'
import { setGuestUser, setSelectedShoppingItemsHydrated, setShoppingItemsState, setUser, setGuestUserHydrated } from '@/service/stateActions';
import { useRouter } from 'expo-router';
import { createTables } from '@/db/schema';
import { getAllShoppingItems, getGuestInfo } from '@/db/EntityManager';
import { ShoppingItemTypes, guestUserType } from '@/service/types';

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
  const {shoppingItemLists, isSelectedShoppingItemsHydrated, guest, isGuestHydrated} = state
  const isLoggedIn = !!guest && Object.keys(guest).length > 0;

  const db = useSQLiteContext();

  useEffect(() => {
    const refetchShoppingItemIfEmpty = async() => {
      if(!isSelectedShoppingItemsHydrated){
        const items: ShoppingItemTypes[] = await getAllShoppingItems(db);
        console.log("RootLayoutInnerProps useEffect")
        console.log(items)
        if(items.length > 0){
          dispatch(setShoppingItemsState(items));
        }
      }else{
        dispatch(setSelectedShoppingItemsHydrated(true));
      }
    }
    refetchShoppingItemIfEmpty();
  }, []);

  useEffect(() => {
    const refetchGuestUserIfEmpty = async() => {
      if(!isLoggedIn && !isGuestHydrated){
        const guest: guestUserType[] = await getGuestInfo(db);
        if (guest.length > 0) {
          dispatch(setGuestUser({...guest[0]}));
        }
      } else {
        dispatch(setGuestUserHydrated(true)); // empty but hydrated
      }
    }
    refetchGuestUserIfEmpty();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      if (!state.isGuestHydrated) return; 
  
      try {
        if (guest && guest.id && guest.country) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)' as any);
        }
      } catch (error) {
        console.error('Login failed:', error);
        router.replace('/(auth)' as any);
      } finally {
        setLoading(false);
      }
    };
  
    restoreSession();
  }, [state.isGuestHydrated, guest]);


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


