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

const ItemDetails = () => {
  const { state, dispatch } = useShoppingListContext();
  const { shoppingItems, guest } = state;
  const { id } = useLocalSearchParams();

  const item = shoppingItems.find((entry: ShoppingItem) => entry.id === id);

  const cleanedItem = item ? cleanUpItem(item) : undefined; 

  const combinedPurchases = cleanedItem?.createDate.map((date, index) => ({
    date: new Date(date),
    quantity: cleanedItem.quantity[index],
    price: cleanedItem.price[index],
    priority: cleanedItem.priority[index],
    purchased: cleanedItem.purchased[index],
  }));

  // 2. Sort by date (newest first)
  const sortedPurchases = combinedPurchases?.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const totalAmountSpent = cleanedItem?.price.reduce((acc, price, index) => {
    const numericPrice = parseFloat(price);
    const quantity = cleanedItem.quantity[index];
  
    if (!isNaN(numericPrice)) {
      acc += numericPrice * quantity;
    }
  
    return acc;
  }, 0);

  return (
    <Box className="mt-2">
      <Card>
        <HStack style={{ justifyContent: "space-between" }}>
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <Icon as={Wallet} size="lg" className="stroke-white" />
            </Avatar>
            <VStack>
              <Heading size="sm">Times Purchased</Heading>
              <Text size="sm">{cleanedItem?.createDate.length}</Text>
            </VStack>
          </HStack>
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <Icon as={Wallet} size="lg" className="stroke-white" />
            </Avatar>
            <VStack>
              <Heading size="sm">Total Spent</Heading>
              <Text size="sm">
                {guest.currency} {totalAmountSpent?.toFixed(2)}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <Divider className="mt-4" />
        <VStack space="md" className="mt-4">
          {sortedPurchases?.map((purchase, index) => (
            <Box key={index} className="p-2 border-b border-gray-200">
              <Text className="text-sm font-semibold">
                {formatDate(purchase.date)} {/* Format date nicely */}
              </Text>
              <Text className="text-sm">Quantity: {purchase.quantity}</Text>
              <Text className="text-sm">Price: {purchase.price || "N/A"}</Text>
              <Text className="text-sm">Priority: {purchase.priority}</Text>
              <Text className="text-sm">
                Purchased: {purchase.purchased ? "Yes" : "No"}
              </Text>
            </Box>
          ))}
        </VStack>
      </Card>
    </Box>
  );
};
export default ItemDetails;
