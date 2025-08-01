import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "./ui/checkbox";
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";
import { useState } from "react";
import CustomInfoDialog from "./CustomInfoDialog";

interface Props {
    // value: string;
    // label: string;
    // isChecked: any;
    //isChecked: (value: string) => boolean;
    shoppingList: CategoryItemResponseType;
    isChecked: (value: string) => boolean;
    handleCheckboxChange: (item: CategoryItemResponseType) => void;
    selectedItem?: ShoppingItemTypes;
    //onChange:any;
    size:any;
    onClose: () => void;
  }

const CustomCheckbox = ({
    // value,
    // label,
    shoppingList,
    isChecked,
    handleCheckboxChange,
    selectedItem,
    //onChange,
    size,
    onClose
  }:Props) => {

    const [showUncheckDialog, setShowUncheckDialog] = useState(false);
  const [pendingItem, setPendingItem] =
    useState<CategoryItemResponseType | null>(null);

    const onCheckboxPress = (item: CategoryItemResponseType) => {
      // console.log("onCheckboxPress")
      // console.log(isChecked(item.value))
      if (isChecked(item.value)) {
        setPendingItem(item);
        setShowUncheckDialog(true);
      } else {
        handleCheckboxChange(item);
      }
    };

    return (
      <>
      <Checkbox
        value={shoppingList.value}
        size={size}
        //isChecked={isChecked}
        isChecked={isChecked(shoppingList.value)}
        //onChange={onChange}
        onChange={() => onCheckboxPress(shoppingList)}
      >
        <CheckboxIndicator
          style={{
            backgroundColor: isChecked(shoppingList.value) ? "#1c1616" : "transparent",
            borderColor: isChecked(shoppingList.value) ? "#000" : "#000",
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
        <CheckboxLabel className="text-xl ml-1 text-gray-900 font-medium flex-wrap">
          {shoppingList.label}
        </CheckboxLabel>
      </Checkbox>
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
        if (onClose) onClose();
      }}
      title="Remove from Cart?"
        message="Are you sure you want to remove this item? Unchecking it will delete the item along with all its details"
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="outline"
    />
      </>
    );
  };
  
  export default CustomCheckbox;