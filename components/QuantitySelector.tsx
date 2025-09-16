import React from "react";
import { TouchableOpacity, DimensionValue } from "react-native";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { HStack } from "./ui/hstack";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

interface QuantitySelectorProps {
  quantity: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete?: () => void;
  borderColor?: string;
  width?: DimensionValue;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
  borderColor = "#FF6347",
  width = "40%",
}) => {
  return (
    <Box
      className="border-2 rounded-full"
      style={{
        borderColor,
        borderWidth: 1,
        width,
        padding: 5,
      }}
    >
      <HStack space="xs" className="justify-evenly items-center">
        {Number(quantity) === 1 && onDelete ? (
          <TouchableOpacity onPress={onDelete}>
            <Box>
              <AntDesignIcon size={16} name="delete" color="#333333" />
            </Box>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onDecrease}>
            <Box>
              <Text className="font-semibold text-2xl">-</Text>
            </Box>
          </TouchableOpacity>
        )}

        <Text className="font-semibold text-lg">{quantity}</Text>

        <TouchableOpacity onPress={onIncrease}>
          <Box>
            <Text className="font-semibold text-xl">+</Text>
          </Box>
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};

export default QuantitySelector;
