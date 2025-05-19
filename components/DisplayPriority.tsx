import { View, FlatList, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "../service/store";
import { updateItem, updatePriority } from "../service/stateActions";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button"
import {ShoppingItem, ShoppingListItem} from "../service/state"
import { useShoppingActions } from "@/db/context/useShoppingList";

type Props = {
  item: ShoppingListItem;
  selectedItem: ShoppingItem;
};

const DisplayPriority = ({ item, selectedItem }: Props) => {
  const { state, dispatch } = useShoppingListContext();
  const {updateShoppingItemFields } = useShoppingActions()

  const handlePrioritySelect = async (id: string, priority: string) => {
    //dispatch(updatePriority(id, priority));
    await updateShoppingItemFields(selectedItem.id, { priority: [priority]}, updateItem);
    
  };

  return (
    <HStack space="md" style={{ alignItems: "center"}} className="mt-4">
      <Text className="font-medium text-md">Priority:</Text>
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
                : "border-gray-200 bg-white-50 border-2"
            }`}
            onPress={() => handlePrioritySelect(item.value, priority)}
          >
            <ButtonText className="font-medium text-typography-700">
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
