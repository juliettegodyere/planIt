import React, { useState } from "react";
import { HStack } from "./ui/hstack";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "./ui/checkbox";
import { CheckIcon } from "./ui/icon";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { Card } from "./ui/card";

interface ShoppingListCheckboxRowProps {
  shoppingList: CategoryItemResponseType;
  isChecked: (value: string) => boolean;
  handleCheckboxChange: (item: CategoryItemResponseType) => void;
  selectedItem?: ShoppingItemTypes;
  onShowInfo?: () => void;
}

const ShoppingListCheckboxRow: React.FC<ShoppingListCheckboxRowProps> = ({
  shoppingList,
  isChecked,
  handleCheckboxChange,
  selectedItem,
  onShowInfo,
}) => {
  console.log("ShoppingListCheckboxRowProps - selectedItem")
  console.log(selectedItem)
  return (
    <Card size="md" variant="elevated" className="m-1">
      <HStack
      space="4xl"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Checkbox
        value={shoppingList.value}
        size="lg"
        isChecked={isChecked(shoppingList.value)}
        onChange={() => handleCheckboxChange(shoppingList)}
      >
        <CheckboxIndicator
          style={{
            backgroundColor: isChecked(shoppingList.value)
              ? "#1c1616"
              : "transparent",
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 9999,
            width: 15,
            height: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CheckboxIcon
            color="#fff"
            as={CheckIcon}
            size="sm"
            style={{ borderWidth: 2 }}
          />
        </CheckboxIndicator>
        <CheckboxLabel className="text-lg ml-1 text-gray-900">
          {shoppingList.label}
        </CheckboxLabel>
      </Checkbox>

      {selectedItem && onShowInfo && (
        <AntDesignIcon
          size={16}
          name="arrowsalt"
          color="#888"
          onPress={onShowInfo}
        />
      )}
    </HStack>
    </Card>
  );
};

export default ShoppingListCheckboxRow;