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
  RepeatIcon,
} from "@/components/ui/icon";
import { Heading } from "./ui/heading";
import DatePickerUtil from "@/Util/DatePickerUtil";
import { useState } from "react";
import TimePickerUtil from "@/Util/TimePickerUtil";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Divider } from "./ui/divider";
import CustomMenu from "./CustomMenu";
import { earlyReminderOptions, repeatReminderOptions } from "@/data/dataStore";

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
  repeatReminder: string;
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
  repeatReminder,
  setRepeatReminder,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isTimeEnabled, setIsTimeEnabled] = useState(true);
  const [isDateEnabled, setIsDateEnabled] = useState(true);

  // const formatDate = (input: string | Date) => {
  //   const date = typeof input === "string" ? new Date(input) : input;

  //   if (isNaN(date.getTime())) return "Invalid date";

  //   if (isToday(date)) return "Today";

  //   if (isTomorrow(date)) return "Tomorrow";

  //   if (isYesterday(date)) return "Yesterday";

  //   return format(date, "EEEE, d MMM"); // e.g., "Friday, 30 Jun"
  // };

  const formatDate = (input: string | Date) => {
    console.log("formatDate - input")
    console.log(input)
    if (!input || input === 'undefined' || input === 'null') return "";

   
  
    const date = typeof input === "string" ? new Date(input) : input;
  
    if (isNaN(date.getTime())) return "";
  
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
  
    return format(date, "EEEE, d MMM yyyy");
  };
  

  const formatTime = (input: string | Date) => {
    console.log("formatTime input:", input);

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

  const handleToggleReminderTime = () => {
    setIsReminderTimeEnabled(!isReminderTimeEnabled);
    if(isReminderTimeEnabled){
      setReminderTime("")
    }
  };

  const handleToggleReminderTimeOpen = () => {
    if (isReminderTimeEnabled) {
      setIsTimeOpen(true);
    }
  };

  const handleToggleReminderDate = () => {
    setIsReminderDateEnabled(!isReminderDateEnabled);
    if(isReminderDateEnabled){
      setReminderDate("")
    }
  };
  

  const handleToggleReminderDateOpen = () => {
    if (isReminderDateEnabled) {
      setIsDateOpen(true);
    }
  };
console.log("ItemReminderComponent - reminderDate")
console.log(reminderDate)
console.log(formatTime(reminderDate))
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
            //onValueChange={setIsReminderDateEnabled}
            onValueChange={handleToggleReminderDate}
            trackColor={{ false: "#D1D5DB", true: "#FF6347" }}
            thumbColor="#F1F1F1"
            ios_backgroundColor="#D1D5DB" // fallback if you're not using Tailwind or colors.gray[300]
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
           // onValueChange={setIsReminderTimeEnabled}
            onValueChange={handleToggleReminderTime}
            trackColor={{ false: "#D1D5DB", true: "#FF6347" }}
            thumbColor="#F1F1F1"
            ios_backgroundColor="#D1D5DB" // fallback if you're not using Tailwind or colors.gray[300]
          />
        </HStack>
      </Pressable>
      <VStack>
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
              console.log(key);
              setEarlyReminder(earlyReminderOptions[Number(key)]);
            }}
          />
        </HStack>
        {/* <Divider className="my-0.5" />
        <HStack
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
      <DatePickerUtil
        //value={reminderDate}
        // value={
        //   typeof reminderDate === "string"
        //     ? new Date(reminderDate)
        //     : reminderDate
        // }
        value={reminderDate}
        //onChange={(newDate) => setReminderDate(newDate)}
        onChange={(newDate) => setReminderDate(newDate)}
        open={isDateOpen}
        onOpenChange={setIsDateOpen}
        mode="date"
        locale="en-GB"
        minimumDate={new Date()}
        theme="light"
      />
      <TimePickerUtil
        //value={reminderTime}
        value={
          typeof reminderTime === "string"
            ? new Date(reminderTime)
            : reminderTime
        }
        //value={safeParseDate(reminderTime)}
        //onChange={setReminderTime}
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
