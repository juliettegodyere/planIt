import { View, FlatList, StyleSheet } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "./ui/vstack";
import { Switch } from "./ui/switch";

type Props = {
//   state: string;
//   handleChange: (text: string) => void;
//   handleBlur: () => void;
//   handleFocus: () => void;
};

const ItemReminderComponent = ({
//   state,
//   handleChange,
//   handleBlur,
//   handleFocus,
}: Props) => {
  return (
    <VStack>
      <HStack
        space="md"
        style={{ justifyContent: "space-between" }}
        className="mt-5"
      >
        <Text className="font-medium text-lg">Early Reminder</Text>
        <Switch
          defaultValue={false}
          trackColor={{ false: "#FF6347", true: "#F1F1F1" }}
          thumbColor="#F1F1F1"
          //onToggle={handleMarkItemAsPurchased}
          // activeThumbColor="#F1F1F1"
          // ios_backgroundColor={colors.gray[300]}
        />
      </HStack>
      <HStack
        space="md"
        style={{ justifyContent: "space-between" }}
        className="mt-5"
      >
        <Text className="font-medium text-lg">Repeat</Text>
        <Switch
          defaultValue={false}
          trackColor={{ false: "#FF6347", true: "#F1F1F1" }}
          thumbColor="#F1F1F1"
          //onToggle={handleMarkItemAsPurchased}
          // activeThumbColor="#F1F1F1"
          // ios_backgroundColor={colors.gray[300]}
        />
      </HStack>
    </VStack>
  );
};
export default ItemReminderComponent;

const styles = StyleSheet.create({});
