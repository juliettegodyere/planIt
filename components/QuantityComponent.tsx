import { View, FlatList, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { VStack } from "./ui/vstack";
import CustomMenu from "./CustomMenu";

type Props = {
  qtyVal:string,
  qtyUnit:string,
  handleUpdateQuantity: (value: string, delta: number) => void;
  SetQtyUnit: (unit: string) => void;
  shoppingList: CategoryItemResponseType;
  qtyOptions: string[];
};

const QuantityComponent = ({ qtyVal, qtyUnit, handleUpdateQuantity,  SetQtyUnit, shoppingList, qtyOptions}: Props) => {
  console.log("QuantityComponent")
  console.log(qtyVal)
  console.log(qtyUnit)
  return (
    <VStack>
      <HStack style={{ justifyContent: "space-between" }}>
        <HStack>
          <Text className="font-medium text-lg">Quantity</Text>
        </HStack>
        <Box
          className="border-2 border-gray-200 rounded-md"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HStack space="xs" style={{ alignItems: "center" }}>
            <Button
              size="sm"
              className="bg-gray-100 border-2 border-gray-200"
              onPress={() => handleUpdateQuantity(shoppingList.value, -1)}
            >
              <Text className="font-semibold text-xl">-</Text>
            </Button>
            <Text className="font-semibold text-lg px-2">{qtyVal}</Text>
            <Button
              size="sm"
              className="bg-gray-100 border-2 border-gray-200"
              onPress={() => handleUpdateQuantity(shoppingList.value, 1)}
            >
              <Text className="font-semibold text-xl">+</Text>
            </Button>
          </HStack>
        </Box>
      </HStack>
      <HStack style={{ justifyContent: "space-between" }} className="mt-5">
        <Text className="font-medium text-lg">Quantity Unit</Text>
        <CustomMenu
          value={qtyUnit}
          menuItems={qtyOptions}
          onSelect={(key) => {
            SetQtyUnit(qtyOptions[Number(key)]);
          }}
        />
      </HStack>
    </VStack>
  );
};
export default QuantityComponent;

const styles = StyleSheet.create({});
