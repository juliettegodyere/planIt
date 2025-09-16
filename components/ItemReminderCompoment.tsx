import { StyleSheet, Pressable } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "./ui/vstack";
import { Switch } from "./ui/switch";
import {
  Icon,
  CalendarDaysIcon,
  ClockIcon,
  BellIcon,
} from "@/components/ui/icon";
import { Heading } from "./ui/heading";
import DatePickerUtil from "@/Util/DatePickerUtil";
import { useState } from "react";
import TimePickerUtil from "@/Util/TimePickerUtil";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Divider } from "./ui/divider";
import CustomMenu from "./CustomMenu";
import { earlyReminderOptions } from "@/data/dataStore";
import { useNotification } from "@/db/context/NotificationProvider";
import { ensureNotificationPermission } from "@/Util/HelperFunction";

type Props = {
  reminderDate: string;
  setReminderDate: (date: string) => void;
  reminderTime: string;
  setReminderTime: (date: string) => void;
  isReminderTimeEnabled: boolean;
  setIsReminderTimeEnabled: (flag: boolean) => void;
  isReminderDateEnabled: boolean;
  setIsReminderDateEnabled: (flag: boolean) => void;
  earlyReminder: string;
  setEarlyReminder: (val: string) => void;
  //repeatReminder: string;
  setRepeatReminder: (val: string) => void;
};

const ItemReminderComponent = ({
  reminderDate,
  setReminderDate,
  reminderTime,
  setReminderTime,
  isReminderTimeEnabled,
  setIsReminderTimeEnabled,
  isReminderDateEnabled,
  setIsReminderDateEnabled,
  earlyReminder,
  setEarlyReminder,
}: Props) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const { requestPermission } = useNotification();


  const formatDate = (input: string | Date) => {
    if (!input || input === "undefined" || input === "null") return "";

    const date = typeof input === "string" ? new Date(input) : input;

    if (isNaN(date.getTime())) return "";

    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";

    return format(date, "EEEE, d MMM yyyy");
  };

  const formatTime = (input: string | Date) => {

    if (!input) return "";

    const date = typeof input === "string" ? new Date(input) : input;

    if (isNaN(date.getTime())) {
      console.warn("Invalid date detected in formatTime:", input);
      return "";
    }

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleReminderTime = async () => {

    const granted = await requestPermission(); 
    if (!granted) {
      setIsReminderTimeEnabled(false); 
      return;
    }

    if (!reminderDate) return;

    const newValue = !isReminderTimeEnabled;

    if (!newValue && reminderDate) {
      return;
    }

    setIsReminderTimeEnabled(newValue);
    if (newValue) {
      setIsTimeOpen(true);
    } else {
      setReminderTime("");
    }
  };

  const handleToggleReminderTimeOpen = () => {
    if (isReminderTimeEnabled) {
      setIsTimeOpen(true);
    }
  };

  const handleToggleReminderDate = async () => {
    const granted = await requestPermission(); // centralised
    if (!granted) {
      setIsReminderTimeEnabled(false); // snap back if denied
      return;
    }

    if (!isReminderDateEnabled) {
      // Don't enable switch yet; just open the date picker
      setIsDateOpen(true);
    } else {
      // If already enabled and toggled off
      setIsReminderDateEnabled(false);
      setReminderDate("");
      setIsReminderTimeEnabled(false);
      setReminderTime("");
    }
  };

  const handleToggleReminderDateOpen = () => {
    if (isReminderDateEnabled) {
      setIsDateOpen(true);
    }
  };

  return (
    <VStack>
      <Pressable onPress={handleToggleReminderDateOpen} className="mb-2">
        <HStack space="lg" className="justify-between w-full">
          <HStack space="lg">
            <Icon
              as={CalendarDaysIcon}
              className="text-typography-500 mt-2"
              size="xl"
              color="red"
            />
            <VStack>
              <Heading>Date</Heading>
              <Text>{formatDate(reminderDate)}</Text>
            </VStack>
          </HStack>
          <Switch
            value={isReminderDateEnabled}
            onValueChange={handleToggleReminderDate}
            trackColor={{ false: "#D1D5DB", true: "#FF6347" }}
            thumbColor="#F1F1F1"
            ios_backgroundColor="#D1D5DB"
          />
        </HStack>
      </Pressable>
      <Divider className="my-0.5" />
      <Pressable onPress={handleToggleReminderTimeOpen} className="mt-2">
        <HStack space="lg" className="justify-between w-full">
          <HStack space="lg">
            <Icon
              as={ClockIcon}
              className="text-typography-500 mt-2"
              size="xl"
              color="blue"
            />
            <VStack>
              <Heading>Time</Heading>
              <Text>{formatTime(reminderTime)}</Text>
            </VStack>
          </HStack>
          <Switch
            value={isReminderTimeEnabled}
            onValueChange={handleToggleReminderTime}
            trackColor={{ false: "#D1D5DB", true: "#FF6347" }}
            thumbColor="#F1F1F1"
            ios_backgroundColor="#D1D5DB"
          />
        </HStack>
      </Pressable>
      <>
        {reminderDate && (
          <VStack>
            {/* Early Reminder */}
            <HStack
              style={{ justifyContent: "space-between" }}
              className="mt-4 mb-2"
            >
              <HStack space="lg">
                <Icon
                  as={BellIcon}
                  className="text-typography-500 mt-2"
                  size="xl"
                  color="purple"
                />
                <Text className="font-medium text-lg">Early Reminder</Text>
              </HStack>
              <CustomMenu
                value={earlyReminder}
                menuItems={earlyReminderOptions}
                onSelect={(key) => {
                  setEarlyReminder(earlyReminderOptions[Number(key)]);
                }}
              />
            </HStack>
            <Divider className="my-0.5" />

            {/* Repeat */}
            {/* <HStack
              style={{ justifyContent: "space-between" }}
              className="mt-4 mb-2"
            >
              <HStack space="lg">
                <Icon
                  as={RepeatIcon}
                  className="text-typography-500 mt-2"
                  size="xl"
                  color="gray"
                />
                <Text className="font-medium text-lg">Repeat</Text>
              </HStack>
              <CustomMenu
                value={repeatReminder}
                menuItems={repeatReminderOptions}
                onSelect={(key) => {
                  console.log(key);
                  setRepeatReminder(repeatReminderOptions[Number(key)]);
                }}
              />
            </HStack> */}
          </VStack>
        )}
      </>
      <DatePickerUtil
        value={reminderDate}
        //onChange={(newDate) => setReminderDate(newDate)}
        onChange={(newDate) => {
          if (newDate) {
            setReminderDate(newDate);
            setIsReminderDateEnabled(true); // ✅ only enable switch if date is picked
            setIsReminderTimeEnabled(true); // ✅ time is now required
            setIsTimeOpen(true); // ✅ open time picker right after
          }
        }}
        open={isDateOpen}
        onOpenChange={setIsDateOpen}
        mode="date"
        locale="en-GB"
        minimumDate={new Date()}
        theme="light"
      />
      <TimePickerUtil
        value={
          typeof reminderTime === "string"
            ? new Date(reminderTime)
            : reminderTime
        }
        onChange={(newTime) => setReminderTime(newTime.toISOString())}
        open={isTimeOpen}
        onOpenChange={setIsTimeOpen}
        locale="en-GB"
        theme="light"
      />
    </VStack>
  );
};
export default ItemReminderComponent;

const styles = StyleSheet.create({});
