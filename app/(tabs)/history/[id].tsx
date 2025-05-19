import { TextInput, View, StyleSheet, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { cleanUpItem, formatDate } from "../../../Util/HelperFunction";
import { ShoppingItem } from "@/service/state";
import { useShoppingListContext } from "@/service/store";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Wallet } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { ChevronUpIcon, ChevronDownIcon } from "@/components/ui/icon";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContentText,
  AccordionIcon,
  AccordionContent,
} from "@/components/ui/accordion";
import { MinusIcon, PlusIcon } from "lucide-react-native";
import ShoppingItemDetails from "@/components/ShoppingItemDetails";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useShoppingActions } from "@/db/context/useShoppingList";
import { updateItem } from "@/service/stateActions";

const ItemDetails = () => {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems, guest } = state;
  const { id } = useLocalSearchParams();
  const {updateShoppingItemFields } = useShoppingActions()

  const item = shoppingItems.find((entry: ShoppingItem) => entry.id === id);

  const cleanedItem = item ? cleanUpItem(item) : undefined;

  const combinedPurchases = cleanedItem?.createDate.map((date, index) => ({
    createDate: new Date(date),
    quantity: cleanedItem.quantity[index],
    price: cleanedItem.price[index],
    priority: cleanedItem.priority[index],
    purchased: cleanedItem.purchased[index],
    selected: cleanedItem.selected[index],
    modifiedDate: new Date(cleanedItem.modifiedDate[index]),
  }));

  // 2. Sort by date (newest first)
  const sortedPurchases = combinedPurchases?.sort(
    (a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime()
  );

  const totalAmountSpent = cleanedItem?.price.reduce((acc, price, index) => {
    const numericPrice = parseFloat(price);
    const quantity = cleanedItem.quantity[index];

    if (!isNaN(numericPrice)) {
      acc += numericPrice * quantity;
    }

    return acc;
  }, 0);

  const handleMarkAsPurchased = async (id: string) => {
    //dispatch(updatePurchase(id));
    //dispatch(updateSelected(id));
    await updateShoppingItemFields(id, { purchased: [true], selected:[false] }, updateItem);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="m-2">
      <Card className="p-6 rounded-lg m-3 bg-inherit">
        <Box className="flex-row justify-between">
          <VStack>
            <Heading size="xl" className="mb-1">
              {cleanedItem?.name}
            </Heading>
            <Text size="md"> {cleanedItem?.category}</Text>
          </VStack>
          <VStack>
            <Heading size="xl" className="mb-1">
              {cleanedItem?.createDate.length}
            </Heading>
            <Text size="md">No. of Transactions</Text>
          </VStack>
        </Box>
      </Card>
      <Box className="pt-7 px-5 pb-2">
        <Heading size="sm">ACTIVITIES</Heading>
      </Box>
      <Accordion className="mx-5 w-[90%] max-w-[640px] bg-transparent">
        {sortedPurchases?.map((purchase, index) => (
          <AccordionItem
            value={`item-${index}`}
            className="rounded-lg m-2"
            key={index}
          >
            <AccordionHeader>
              <AccordionTrigger className="focus:web:rounded-lg">
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText className="text-xl">
                        Purchased - {formatDate(purchase.modifiedDate)}
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="ml-9">
              <ShoppingItemDetails
                item={cleanedItem}
                isSelected={purchase.selected}
                selectedItem={cleanedItem}
              />
              <Box className="py-4">
                <TextInput
                  style={styles.textArea}
                  multiline={true}
                  numberOfLines={4}
                  placeholder="Add Notes ..."
                  // onChangeText={setText}
                  // value={text}
                  underlineColorAndroid="transparent"
                  className="border-2 border-gray-200 rounded-md"
                />
              </Box>
              <Text className="text-sm font-extralight">
                Add tags to keep track of your spending and powerful personal
                searches. Something like #fuek, #hobbies or whatever works
              </Text>

              <Box className="py-4">
                <Button
                  size="sm"
                  variant="outline"
                  action="primary"
                  className="border-2 border-gray-200"

                  //onPress={() => handleMarkAsPurchased(entry)}
                >
                  <ButtonText className="font-medium text-sm ml-2">
                    Undo
                  </ButtonText>
                </Button>
              </Box>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollView>
  );
};
export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textArea: {
    height: 100,
    justifyContent: "flex-start",
    textAlignVertical: "top", // Ensures text starts at the top-left
    //borderColor: '#ccc',
    //borderWidth: 1,
    padding: 10,
  },
});
