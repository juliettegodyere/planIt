import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/stateManager";
import { updatePriority } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button"

interface ShoppingListItem {
  label: string;
  value: string;
  category: string;
}

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
};

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number[];
  qtyUnit: string[];
  price: string[];
  purchased: boolean[];
  selected: boolean[]; // ✅ Ensure selected is an array
  createDate: string[];
  modifiedDate: string[];
  priority: string[];
  category: string;
}

const DisplayPriority = ({ item, selectedItem }: Props) => {
  const { state, dispatch } = useShoppingListContext();

  const handlePrioritySelect = (id: string, priority: string) => {
    dispatch(updatePriority(id, priority));
  };

  return (
    <HStack space="md" style={{ alignItems: "center", paddingVertical: 10 }}>
      <Text className="text-typography-400 font-medium">Priority:</Text>
      <HStack space="sm">
        {["Low", "Medium", "High"].map((priority, idx) => (
          <Button
            key={idx}
            size="sm"
            className={`px-3 ${
              selectedItem?.priority[selectedItem.priority.length - 1] ===
              priority
                ? priority === "High"
                  ? "bg-red-500 text-white"
                  : priority === "Medium"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-400 text-black"
                : "bg-gray-200"
            }`}
            onPress={() => handlePrioritySelect(item.value, priority)}
          >
            <ButtonText className="text-typography-400 font-medium">
              {priority}
            </ButtonText>
          </Button>
        ))}
      </HStack>
    </HStack>
  );
};
export default DisplayPriority;

const styles = StyleSheet.create({});
