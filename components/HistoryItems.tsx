import { TouchableOpacity } from "react-native";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { ShoppingItem } from "@/service/state";
import { theme } from "@/assets/colors";
import { router } from "expo-router";
import { Card } from "./ui/card";
import { Button, ButtonText } from "./ui/button";
import colors from "tailwindcss/colors";
import { VStack } from "./ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "./ui/hstack";
import { updatePurchase } from "@/service/stateActions";
import { ShoppingListAction, useShoppingListContext } from "@/service/store";
import { formatDate } from "../Util/HelperFunction";

interface HistoryItemProps {
  items: [string, ShoppingItem[]];
}
export default function HistoryItem({ items }: HistoryItemProps) {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems } = state;

  const handleMarkAsPurchased = (entry: ShoppingItem) => {
    dispatch(updatePurchase(entry.id));
  };
  const toggleUndoButton = (entry: ShoppingItem) => {
    const item = shoppingItems.find((i: ShoppingItem) => i.id === entry.id);
    return item?.purchased[item.purchased.length - 1] === true;
  };

  //console.log(items)
  return (
    <Box className="px-2">
      <Text className="text-xl, font-bold text-gray-600 mt-2">
        {formatDate(items[0])}
      </Text>
      {items[1].map((entry) => {
        console.log("Testing");
        console.log(entry);
        console.log(entry.id);
        const isBought =
          entry?.purchased?.[entry.purchased.length - 1] || false;
        const isSelected =
          entry?.selected?.[entry.selected.length - 1] || false;

        return (
          <Card key={entry.id} className="my-1">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/history/[id]",
                  params: { id: entry.id },
                })
              }
            >
              <HStack style={{ justifyContent: "space-between" }}>
                <VStack>
                  <Text className="text-xl font-extrabold">{entry.name}</Text>
                  <Text className="text-sm font-medium text-gray-400">
                    {entry.category}
                  </Text>
                </VStack>
                {toggleUndoButton(entry) && (
                  <Box>
                    <Button
                      size="sm"
                      variant="outline"
                      action="primary"
                      style={{
                        borderColor: isBought
                          ? "#E82B35"
                          : theme.colors.buttonPrimary,
                        borderWidth: 1,
                      }}
                      onPress={() => handleMarkAsPurchased(entry)}
                    >
                      <ButtonText className="font-medium text-sm ml-2">Undo</ButtonText>
                    </Button>
                  </Box>
                )}
              </HStack>
            </Pressable>
          </Card>
        );
      })}
    </Box>
  );
}
