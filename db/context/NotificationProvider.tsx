// context/NotificationProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  deleteReminder,
  getAllReminders,
  updateReminderNotificationId,
  updateReminderFields,
  getAllShoppingItems,
} from "../EntityManager";
import { useSQLiteContext } from "expo-sqlite";
import { ReminderItemType, ShoppingItemTypes } from "@/service/types";
import { ensureNotificationPermission, getEarlyReminderOffsetMs } from "@/Util/HelperFunction";
import { setShoppingItemsState } from "@/service/stateActions";
import { useShoppingListContext } from "@/service/store";

interface NotificationContextType {
  scheduleReminder: (
    id: string,
    title: string,
    body: string,
    date: string,
    time: string,
    earlyReminder: string,
    //repeat: string,
    item_id: string,
    isReminderTimeEnabled: boolean,
    isReminderDateEnabled: boolean,
    fired: boolean,
    snooze?:boolean,
  ) => Promise<string | null>;
  reScheduleReminder: (
    id: string,
    title: string,
    body: string,
    date: string,
    time: string,
    earlyReminder: string,
   // repeat: string,
    item_id: string,
    isReminderTimeEnabled: boolean,
    isReminderDateEnabled: boolean,
    fired: boolean,
   // snooze?:boolean,
  ) => Promise<string | null>;
  cancelReminder: (id: string) => Promise<void>;
  reloadReminders: () => Promise<void>;
  loadReminders: () => Promise<void>;
  reminders: ReminderItemType[];
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  requestPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => useContext(NotificationContext)!;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const db = useSQLiteContext();
  const [reminders, setReminders] = useState<ReminderItemType[]>([]);
  const { state, dispatch } = useShoppingListContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // const setup = async () => {
    //   await setupPermissions(); // Ask notification permissions
    //   //await reloadReminders(); // Load and reschedule any stored reminders
    //   await loadReminders()
    // };

    const setup = async () => {
      const { status } = await Notifications.getPermissionsAsync();
  
      if (status !== "granted") {
        // First-time (or denied before) → request explicitly
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        setNotificationsEnabled(newStatus === "granted");
      } else {
        // Already granted
        setNotificationsEnabled(true);
      }
  
      await loadReminders();
    };

    setup();
  }, []);
  

  const setupPermissions = async () => {
    const settings = await Notifications.getPermissionsAsync();
    if (!settings.granted) {
      await Notifications.requestPermissionsAsync();
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    const ok = await ensureNotificationPermission();
    setNotificationsEnabled(ok); // update global state
    return ok; // let caller know if permission was granted
  };

  const loadReminders = async () => {
    const allReminders = await getAllReminders(db);
    setReminders(allReminders);
  };

  const scheduleReminder = async (
    id: string,
    title: string,
    body: string,
    date: string,
    time: string,
    earlyReminder: string,
    //repeat: string,
    item_id: string,
    isReminderTimeEnabled: boolean,
    isReminderDateEnabled: boolean,
    fired: boolean,
  ): Promise<string | null> => {

    if (!isReminderDateEnabled && !isReminderTimeEnabled) {
      return null;
    }

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(time),
      //...(repeat_ ? { repeatFrequency: repeat_ } : {}),
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true,  data: {
        screen: 'notification',
        id: id,
      },},
      trigger,
    });

    return notificationId;
  };


  const reScheduleReminder = async (
    id: string,
    title: string,
    body: string,
    date: string,
    time: string,
    earlyReminder: string,
   // repeat: string,
    item_id: string,
    isReminderTimeEnabled: boolean,
    isReminderDateEnabled: boolean,
    fired: boolean,
    //snooze?:boolean
  ): Promise<string | null> => {
    if (!isReminderDateEnabled && !isReminderTimeEnabled) {
      return null;
    }

    const offsetMs = getEarlyReminderOffsetMs(earlyReminder ?? "0 minutes");
    const adjustedReminderTime = new Date(Math.max(offsetMs, Date.now() + 1000)); // always future

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: adjustedReminderTime,
     // ...(repeat_ ? { repeatFrequency: repeat_ } : {}),
    };

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true,  data: {
        screen: 'notification',
        id: id,
      },},
      trigger,
    });

    const updateFields: Partial<ReminderItemType> = { notificationId, date, time, fired:false};
    await updateReminderFields(db, id, updateFields);

    // ✅ Refetch All Data from DB
    const items: ShoppingItemTypes[] = await getAllShoppingItems(db);
    if (items.length > 0) {
      const index = items.findIndex(item => item.id === item_id);
    
      if (index !== -1) {
        const updatedItem = {
          ...items[index],
          reminder_id: id, // update reminder ID
          fired:false
        };
    
        const updatedItems = [
          ...items.slice(0, index),
          updatedItem,
          ...items.slice(index + 1),
        ];
    
        // ✅ Update state with the new array
        dispatch(setShoppingItemsState(updatedItems));
      }
    }

    return notificationId;
  };

  const cancelReminder = async (id: string) => {
    try {
      const reminders = await getAllReminders(db);
      const reminder = reminders.find((r) => r.id === id);
      if (reminder?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          reminder.notificationId
        );
      }
      await deleteReminder(db, id);
    } catch (err) {
      console.warn("Cancel failed:", err);
    }
  };

  const reloadReminders = async () => {
    const reminders = await getAllReminders(db);

    for (const r of reminders) {
      if (!r.date || !r.time) continue; // 

      const now = new Date();
      const date = new Date(r.date);
      const time = new Date(r.time);

      // Combine date and time into one datetime
      const reminderDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
      );

    // Apply earlyReminder offset (same as saveReminder)
    const offsetMs = getEarlyReminderOffsetMs(r.earlyReminder ?? "0 minutes");
    const adjustedReminderTime = new Date(reminderDateTime.getTime() - offsetMs);

    // Ensure trigger time is in the future
    const finalTriggerTime = adjustedReminderTime > now ? adjustedReminderTime : reminderDateTime;

    // Map repeat string to Notifications API type
    //const repeat = getRepeatType(r.repeat ?? "Never");

      const trigger: Notifications.DateTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        //date: new Date(r.time),
        date:finalTriggerTime,
       // ...(repeat ? { repeatFrequency: repeat } : {}),
      };

      //const trigger = getNotificationTrigger(r.date, r.time, r.repeat);

      if (trigger) {
        const newId = await Notifications.scheduleNotificationAsync({
          content: { title: r.title, body: r.body, sound: true },
          trigger,
        });

        if (!r.id) {
          throw new Error("Reminder ID is missing — cannot update notificationId.");
        }
        
        await updateReminderNotificationId(db, r.id, newId);

        //await saveReminder(db, reminderItem);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{ scheduleReminder, reScheduleReminder, cancelReminder, reloadReminders, loadReminders, reminders, notificationsEnabled, setNotificationsEnabled, requestPermission}}
    >
      {children}
    </NotificationContext.Provider>
  );
};
