import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useNotification } from "../../db/context/NotificationProvider";

import React, { useEffect, useRef, useState } from "react";
import { CategoryItemResponseType, ReminderItemType } from "@/service/types";
import { useSQLiteContext } from "expo-sqlite";
import {
  formatDate,
  formatTime,
} from "@/Util/HelperFunction";
import { useShoppingListContext } from "@/service/store";
import { Card } from "@/components/ui/card";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import ItemInformationSheetController, { ItemInformationSheetHandle } from "@/components/ItemInformationSheetController";
import { ShoppingListStateTypes } from "@/service/state";
import { updateItem } from "@/service/stateActions";
import { updateReminderFields } from "@/db/EntityManager";
import { HStack } from "@/components/ui/hstack";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Notification() {
  const [remindersFiredOnly, setRemindersFiredOnly] = useState<
    ReminderItemType[]
  >([]);
  const {
    reminders,
    loadReminders,
  } = useNotification();
  const db = useSQLiteContext();
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists, catalogItems} = state;
  const sheetRef = useRef<ItemInformationSheetHandle>(null);

  useEffect(() => {
    loadReminders();
    const firedOnly = reminders.filter((r) => r.fired);
    setRemindersFiredOnly(firedOnly);
  }, [db, state.shoppingItemLists]);

  const handleNotificationPress = async (selectedItem: ShoppingListStateTypes, catalogItem: CategoryItemResponseType) => {  
    const remi = reminders.find((ri) => ri.item_id === selectedItem.id);
    if (!remi?.id) return;

    await updateReminderFields(db, remi.id, { notified: true, fired:false });

    const updatedItem: ShoppingListStateTypes = 
  { 
      ...selectedItem, 
      ...remi, 
      id: selectedItem.id, 
      reminder_id: selectedItem.reminder_id ,
      notified:true,
      fired:false
    };
  
    dispatch(updateItem(selectedItem.id, updatedItem));
  
    sheetRef.current?.open(updatedItem, catalogItem);
  }


  const renderItem = ({ item }: { item: ReminderItemType }) => {
    const shoppingItem = shoppingItemLists.find((si) => si.id === item.item_id);
    const catalogItem = catalogItems.find((ca) => ca.label == shoppingItem?.name);

    if (!shoppingItem || shoppingItem.purchased) {
      return null; // skip rendering
    }
  
    const showRed = item.fired && !item.notified;
  
    const onPress = () => {
      if (!shoppingItem) return; // guard against undefined
      if (!catalogItem) return;
      if (!item.id) return;
      handleNotificationPress(shoppingItem, catalogItem);
    };
  
    return (
      <Card>
        <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
          <HStack space="md" className="justify-between">
          <VStack>
            <Heading
              size="md"
              className="font-bold mb-2"
              style={{ color: showRed ? "red" : "black" }}
            >
              {item.title}
            </Heading>
            <Text size="md" style={{ color: showRed ? "red" : "black" }}>
              {item.body}
            </Text>
            <Text size="md" style={{ color: showRed ? "red" : "black" }}>
              {item.date ? formatDate(item.date) : ""} at {formatTime(item.time)}
            </Text>
          </VStack>
          <MaterialIcons 
            name={item.fired && !item.notified ? "notifications-active" : "notifications-none"} 
            size={24} 
            color={showRed ? "red" : "gray"} 
          />
          </HStack>
        </TouchableOpacity>
      </Card>

    );
  };
  
  return (
    <>
    <FlatList
      data={reminders}
      keyExtractor={(item) => item.id!}
      renderItem={renderItem}
      ListEmptyComponent={
       <VStack space="md" className="p-4">
        <Heading>You have not received any notification yet</Heading>
        <Text>If you set a reminder for an item, the notification will apear here. </Text>
        <Text>To receive notification directly to your device, you must turn on push notifications in your settings. </Text>
       </VStack>
      }
    />
    <ItemInformationSheetController ref={sheetRef} /></>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    //flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3498db",
    backgroundColor: "white",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#3498db",
    fontWeight: "bold",
    textAlign: "center",
  },
});
