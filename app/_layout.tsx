import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  SQLiteProvider,
  useSQLiteContext,
} from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { ShoppingListProvider, useShoppingListContext } from "../service/store";
import {
  setGuestUser,
  setSelectedShoppingItemsHydrated,
  setShoppingItemsState,
  setGuestUserHydrated,
} from "@/service/stateActions";
import { useRouter } from "expo-router";
import { createTables } from "@/db/schema";
import {
  getAllShoppingItems,
  getGuestInfo,
  getReminderById,
  markReminderAsFired,
} from "@/db/EntityManager";
import {
  ShoppingItemTypes,
  guestUserType,
} from "@/service/types";
import * as Notifications from "expo-notifications";
import {
  NotificationProvider,
  useNotification,
} from "@/db/context/NotificationProvider";
import { updateItem } from "@/service/stateActions";
import { ShoppingListStateTypes } from "@/service/state";

type NotificationData = {
  screen?: string;
  id?: string;
};

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  return (
    <GluestackUIProvider mode={colorMode}>
      <SQLiteProvider databaseName="shopping.db" onInit={createTables}>
        <ShoppingListProvider>
          <NotificationProvider>
            <RootLayoutInner
              loading={loading}
              setLoading={setLoading}
              router={router}
            />
          </NotificationProvider>
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

function RootLayoutInner({
  router,
}: RootLayoutInnerProps) {
  const { state, dispatch } = useShoppingListContext();
  const { isSelectedShoppingItemsHydrated, guest, isGuestHydrated } = state;
  const db = useSQLiteContext();
  const {
    loadReminders,
  } = useNotification();

  const handleGlobalStateUpdate = async (reminderId: string) => {
    const reminder = await getReminderById(db, reminderId);
    if (!reminder) return;

    const items_ = state.shoppingItemLists.find(
      (x) => x.id === reminder.item_id
    );
    if (!items_) return;

    const itemToDispatch: ShoppingListStateTypes = {
      ...items_,
      reminder_id: items_.reminder_id ? items_.reminder_id : reminder.id,
      fired: reminder.fired ?? false,
    };
    dispatch(updateItem(items_.id!, itemToDispatch));
    await loadReminders();
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    // Fires when notification is delivered (only in foreground)
    const receivedSub = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const data = notification.request.content.data as NotificationData;
        if (data?.id) {
          await markReminderAsFired(db, data.id);
          await handleGlobalStateUpdate(data.id);
        }
      }
    );
    // Fires when user taps/interacts (foreground or background)
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const data = response.notification.request.content
          .data as NotificationData;
        if (data?.id) {
          await markReminderAsFired(db, data.id);
          await handleGlobalStateUpdate(data.id);
        }

        if (typeof data?.screen === "string") {
          router.push(data.screen as any);
        }
      }
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, [db, state.shoppingItemLists]);

  useEffect(() => {
    const refetchShoppingItemIfEmpty = async () => {
      if (!isSelectedShoppingItemsHydrated) {
        const items: ShoppingItemTypes[] = await getAllShoppingItems(db);
        if (items.length > 0) {
          dispatch(setShoppingItemsState(items));
        }
      } else {
        dispatch(setSelectedShoppingItemsHydrated(true));
      }
    };
    refetchShoppingItemIfEmpty();
  }, [db, state.shoppingItemLists]);

  useEffect(() => {
    const refetchGuestUserIfEmpty = async () => {
      if (!isGuestHydrated) {
        const guest: guestUserType[] = await getGuestInfo(db);
        if (guest.length > 0) {
          dispatch(setGuestUser({ ...guest[0] }));
        }
      }
      dispatch(setGuestUserHydrated(true));
      router.replace("/(tabs)"); // navigate after hydration
    };
  
    refetchGuestUserIfEmpty();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, title: "Login" }}
        />
        <Stack.Screen
          name="others"
          options={{ 
            headerShown: true, 
            title: "Purchased Item History" ,
            headerTintColor: "#000000",
            headerBackTitle: "Close",            // iOS: forces no text
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
