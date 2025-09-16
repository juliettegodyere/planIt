import React, { Dispatch, useState } from "react";
import { HStack } from "./ui/hstack";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "./ui/checkbox";
import { CheckIcon } from "./ui/icon";
import { CategoryItemResponseType } from "@/service/types";
import CustomInfoDialog from "./CustomInfoDialog";
import { ShoppingListStateTypes } from "@/service/state";
import { handleDeleteItem } from "@/Util/HelperFunction";
import { useShoppingListContext } from "@/service/store";
import { useShoppingActions } from "@/db/Transactions";


interface ShoppingListCheckboxRowProps {
  shoppingList: CategoryItemResponseType;
  shoppingItem: ShoppingListStateTypes;
  isChecked: (value: string, id:string) => boolean;
  shoppingItemLists: ShoppingListStateTypes[],
  dispatch: Dispatch<any>,
  deleteShoppingItemAndReturn: (id: string) => Promise<ShoppingListStateTypes | undefined>
  // handleCheckboxChange: (item: CategoryItemResponseType) => void;
  sheetRef?: React.RefObject<any>;
}

const ShoppingListCheckboxRow: React.FC<ShoppingListCheckboxRowProps> = ({
  shoppingList,
  shoppingItem,
  isChecked,
  shoppingItemLists,
  dispatch,
  deleteShoppingItemAndReturn
}) => {
  const [showUncheckDialog, setShowUncheckDialog] = useState(false);
  const [pendingItem, setPendingItem] = useState<CategoryItemResponseType | null>(null);
    // const { state, dispatch } = useShoppingListContext();
    //const { deleteShoppingItemAndReturn} = useShoppingActions();


  const onCheckboxPress = (item: CategoryItemResponseType) => {
    if (isChecked(item.value, shoppingItem.id)) {
      //setPendingItem(item);
     
      setShowUncheckDialog(true);
    } else {
      console.log("It on checked")
      //handleCheckboxChange(item);
    }
  };

  return (
    <>
      <Checkbox
        value={shoppingList.value}
        size="lg"
        isChecked={isChecked(shoppingList.value, shoppingItem.id)}
        onChange={() => onCheckboxPress(shoppingList)}
        className="max-w-[70%]"
      >
        <CheckboxIndicator
          style={{
            backgroundColor: isChecked(shoppingList.value, shoppingItem.id)
              ? "#FF6347"
              : "#FFFFFF",
            borderColor: "#FF6347",
            borderWidth: 1,
            // borderRadius: 9999,
            // width: 15,
            // height: 15,

            // justifyContent: "center",
            // alignItems: "center",
            padding: 10,
          }}
        >
          <CheckboxIcon
            color="#fff"
            as={CheckIcon}
            size="lg"
            //style={{ borderWidth: 2 }}
          />
        </CheckboxIndicator>
        <CheckboxLabel className="text-xl ml-1 font-bold" style={{color: "#333333"}}>
          {shoppingList.label}
        </CheckboxLabel>
      </Checkbox>
      {/* Confirmation Dialog */}
      <CustomInfoDialog
        isOpen={showUncheckDialog}
        onClose={() => {
          setShowUncheckDialog(false);
          setPendingItem(null);
        }}
        onConfirm={() => {
          //if (pendingItem) handleCheckboxChange(pendingItem);
          handleDeleteItem(shoppingItem.id, shoppingList, shoppingItemLists, dispatch, deleteShoppingItemAndReturn)

          setShowUncheckDialog(false);
          setPendingItem(null);
          //sheetRef?.current?.close();
        }}
        title="Remove from Cart?"
        message="Unchecking will remove this item from the list and cart. Do you want to continue?"
        confirmText="Continue"
        cancelText="Cancel"
        confirmVariant="outline"
      />
    </>
  );
};

export default ShoppingListCheckboxRow;
