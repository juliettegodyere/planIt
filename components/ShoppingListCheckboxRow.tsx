import React, { useState } from "react";
import { HStack } from "./ui/hstack";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "./ui/checkbox";
import { CheckIcon } from "./ui/icon";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { Card } from "./ui/card";
import { Text } from "./ui/text";
import { formatReminderDateTime, isReminderDue } from "@/Util/HelperFunction";
import CustomInfoDialog from "./CustomInfoDialog";

interface ShoppingListCheckboxRowProps {
  shoppingList: CategoryItemResponseType;
  isChecked: (value: string) => boolean;
  handleCheckboxChange: (item: CategoryItemResponseType) => void;
  selectedItem?: ShoppingItemTypes;
  onShowInfo?: () => void;
  sheetRef?: React.RefObject<any>; // add this
}

const ShoppingListCheckboxRow: React.FC<ShoppingListCheckboxRowProps> = ({
  shoppingList,
  isChecked,
  handleCheckboxChange,
  selectedItem,
  onShowInfo,
  sheetRef
}) => {
  const [showUncheckDialog, setShowUncheckDialog] = useState(false);
  const [pendingItem, setPendingItem] =
    useState<CategoryItemResponseType | null>(null);

  const onCheckboxPress = (item: CategoryItemResponseType) => {
    if (isChecked(item.value)) {
      setPendingItem(item);
      setShowUncheckDialog(true);
    } else {
      handleCheckboxChange(item);
    }
  };

  return (
    <>
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
            //onChange={() => handleCheckboxChange(shoppingList)}
            onChange={() => onCheckboxPress(shoppingList)}
            className="max-w-[70%]"
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
            <CheckboxLabel className="text-xl ml-1 text-gray-900">
              {shoppingList.label}
            </CheckboxLabel>
          </Checkbox>

          {selectedItem && onShowInfo && (
            <AntDesignIcon
              size={16}
              name="arrowsalt"
              color="#888"
              onPress={onShowInfo}
              className="max-w-[20%]"
            />
          )}
        </HStack>
        {/**This card is used for reminders and the implementation is relatively complete. It is 
                 * disabled and will be used in V2 */}
        {/* {selectedItem &&
          isReminderDue(
            selectedItem.reminderDate,
            selectedItem.reminderTime,
            selectedItem.earlyReminder,
            selectedItem.repeatReminder
          ) && (
            <Text className="text-red-600 font-semibold">
              Reminders{" "}
              {formatReminderDateTime(
                selectedItem.reminderDate,
                selectedItem.reminderTime
              )}
            </Text>
          )} */}
      </Card>
      {/* Confirmation Dialog */}
      <CustomInfoDialog
        isOpen={showUncheckDialog}
        onClose={() => {
          setShowUncheckDialog(false);
          setPendingItem(null);
        }}
        onConfirm={() => {
          if (pendingItem) handleCheckboxChange(pendingItem);
          setShowUncheckDialog(false);
          setPendingItem(null);
          sheetRef?.current?.close();
        }}
        title="Move from Cart?"
        message="Are you sure you want to delete this item? Unchecking the item will remove all details as well."
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="outline"
      />
    </>
  );
};

export default ShoppingListCheckboxRow;
