import { TouchableOpacity } from "react-native";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { theme } from "@/assets/colors";
import { router } from "expo-router";
import { Card } from "./ui/card";
import { Button, ButtonText } from "./ui/button";
import colors from "tailwindcss/colors";
import { VStack } from "./ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "./ui/hstack";
import { ShoppingListAction, useShoppingListContext } from "@/service/store";
import { formatDate } from "../Util/HelperFunction";
import { SelectedItemType } from "@/service/state";

interface HistoryItemProps {
  items: SelectedItemType[];
}
export default function HistoryItem({ items }: HistoryItemProps) {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItemLists } = state;

  const handleMarkAsPurchased = (entry: SelectedItemType) => {
   // dispatch(updatePurchase(entry.id));
  };
  const toggleUndoButton = (entry: SelectedItemType) => {
    const item = shoppingItemLists.find((i: SelectedItemType) => i.id === entry.id);
    return item?.purchased === true;
  };

  //console.log(items)
  return (
    <Box className="px-2">
      {/* <Text className="font-semibold mt-2 text-2xl py-3">
        {formatDate(items[0])}
      </Text>
      {items[1].map((entry) => {
        console.log("Testing");
        console.log(entry);
        console.log(entry.id);
        const isBought =
          entry?.purchased || false;
        const isSelected =
          entry?.selected|| false;
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
                  <Text className="text-3xl font-bold font-roboto">{entry.name}</Text>
                  <Text className="text-xl font-medium font-roboto text-gray-400">
                    {entry.category}
                  </Text>
                </VStack>
                <Box> */}
                  {/* <Text className="text-3xl font-bold font-roboto">{entry.purchased.length}</Text> */}
                {/* </Box> */}
                {/* {toggleUndoButton(entry) && (
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
                )} */}
              {/* </HStack>
            </Pressable>
          </Card>
        );
      })} */}
    </Box>
  );
}
