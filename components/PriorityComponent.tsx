import { StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import CustomMenu from "./CustomMenu";
import { Box } from "./ui/box";

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
     <Box > 
     <Text className="font-medium text-lg" style={{color:"#888888"}}>Priority</Text>
     </Box>
      <CustomMenu
        value={priorityVal}
        menuItems={priorityOption}
        onSelect={(key) => {
          setPriorityVal(priorityOption[Number(key)]);
        }}
        text="Select Priority"
      />
    </HStack>
  );
};
export default PriorityComponent;

const styles = StyleSheet.create({});
