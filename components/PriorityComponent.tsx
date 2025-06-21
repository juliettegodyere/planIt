import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import CustomMenu from "./CustomMenu";

type Props = {
  priorityVal: string;
  priorityOption: string[];
  setPriorityVal: (priority: string) => void;
};

const PriorityComponent = ({
  priorityVal,
  priorityOption,
  setPriorityVal,
}: Props) => {
  return (
    <HStack style={{ justifyContent: "space-between" }} className="">
      <Text className="font-medium text-lg">Priority</Text>
      <CustomMenu
        value={priorityVal}
        menuItems={priorityOption}
        onSelect={(key) => {
          console.log(typeof key + "ShoppingListItemComponent");
          console.log(priorityOption[Number(key)]);
          setPriorityVal(priorityOption[Number(key)]);
        }}
      />
    </HStack>
  );
};
export default PriorityComponent;

const styles = StyleSheet.create({});
