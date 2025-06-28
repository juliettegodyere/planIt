import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Card } from "@/components/ui/card";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { HStack } from "./ui/hstack";
import { CheckIcon } from "@/components/ui/icon";

import AntDesignIcon from "@expo/vector-icons/AntDesign";
import { checkboxControlActions } from "@/hooks/checkboxControlActions";

import { useShoppingListContext } from "@/service/store";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { useShoppingActions } from "@/db/Transactions";
import { useSQLiteContext } from "expo-sqlite";
import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import ItemInformationSheet from "./ItemInformationSheet";
import { priorityOption, qtyOptions } from "@/data/dataStore";
import { ActionType, AttachmentParam, AttachmentType } from "./type";
import ShoppingListCheckboxRow from "./ShoppingListCheckboxRow";
import ItemInformationSheetController, { ItemInformationSheetHandle } from "./ItemInformationSheetController";

type Props = {
  shoppingList: CategoryItemResponseType;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
};

export default function ShoppingListItemComponent({
  shoppingList,
  isModalOpen,
  onCloseModal,
}: Props) {
  const { state, dispatch } = useShoppingListContext();
  const [showModal, setShowModal] = useState(false);
  useState(false);
  const [showNoteActionsheet, setShowNoteActionsheet] = useState(false);
  const [showItemInformationActionsheet, setShowItemInformationActionsheet] =
    useState(false);
    const [showBottomsheet, setShowBottomsheet] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<
    ShoppingItemTypes | undefined
  >();
  const [priceInput, setPriceInput] = useState("0");
  const [itemPurchase, setItemPurchase] = useState(false);
  const [qtyVal, SetQtyVal] = useState("1");
  const [qtyUnit, SetQtyUnit] = useState("None");
  const [priorityVal, setPriorityVal] = useState("None");
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<AttachmentParam[]>([]);
  const [actionType, setActionType] = useState<ActionType | null>('none');
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);

  const sheetRef = useRef<ItemInformationSheetHandle>(null);

  const toast = useToast();
  const db = useSQLiteContext();
  const {
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState,
  } = useShoppingActions();
  const { isChecked, handleCheckboxChange } = checkboxControlActions(
    db,
    state,
    dispatch,
    addNewItemToShoppingItemsAndUpdateState,
    updateShoppingItemAndUpdateState
  );

  const initialValuesRef = useRef({
    priceInput,
    itemPurchase,
    qtyVal,
    qtyUnit,
    priorityVal,
    note,
    attachments,
  });

  // if (loading) return <Text>Loading...</Text>;

  useEffect(() => {
    console.log("state.shoppingItemLists")
    console.log(state.shoppingItemLists)
    const item = state.shoppingItemLists.find(
      (i) =>
        i.key === shoppingList.value &&
        i.selected === true &&
        i.purchased === false
    );
    setSelectedItem(item);
  }, [state.shoppingItemLists, shoppingList]);

  useEffect(() => {
    if (actionType) {
      setShowActionsheet(actionType !== 'none');
    }
  }, [actionType]);

  useEffect(() => {
    if (showItemInformationActionsheet) {
      initialValuesRef.current = {
        priceInput,
        itemPurchase,
        qtyVal,
        qtyUnit,
        priorityVal,
        note,
        attachments,
      };
    }
  }, [showItemInformationActionsheet]);

  const handleShowItemInformationActionsheet = () => {
    if (!selectedItem) return;
  
    // Set values from selectedItem if they exist
    setPriceInput(selectedItem.price ?? "0");
    setItemPurchase(selectedItem.purchased ?? false);
    SetQtyVal(selectedItem.quantity ?? "1");
    SetQtyUnit(selectedItem.qtyUnit ?? "None");
    setPriorityVal(selectedItem.priority ?? "None");
    setNote(selectedItem.note ?? "");
    //setAttachments(selectedItem.attachments ? JSON.parse(selectedItem.attachments) : []);
  
    // Show sheet
    setShowItemInformationActionsheet(true);
  };

  const hasChanges = () => {
    const initial = initialValuesRef.current;
    return (
      priceInput !== initial.priceInput ||
      itemPurchase !== initial.itemPurchase ||
      qtyVal !== initial.qtyVal ||
      qtyUnit !== initial.qtyUnit ||
      priorityVal !== initial.priorityVal ||
      note !== initial.note ||
      attachments !== initial.attachments
    );
  };

  // const handleItemInformationActionsheetClose = () =>{
  //   setShowItemInformationActionsheet(false);
  
  // }

  const handleItemInformationActionsheetClose = () => {
    if (hasChanges()) {
      setShowDiscardConfirmation(true);
    } else {
      setShowItemInformationActionsheet(false);
    }
  };

  const handleDiscard = () => {
    setPriceInput("£ ");
    setItemPurchase(false);
    SetQtyVal("1");
    SetQtyUnit("None");
    setPriorityVal("None");
    setNote("");
    setAttachments([]);
    setShowItemInformationActionsheet(false);
    setShowDiscardConfirmation(false);
  };
   
  const handleItemInformationActionsheetUpdate = () => {
    console.log("Update item");
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isSelected = selectedItem?.selected ?? false;
  const isPurchased = selectedItem?.purchased ?? false;

  const handleUpdateItems = async () => {
    const now = new Date().toISOString();
  
    if (!selectedItem?.id) {
      console.error("Cannot update item: ID is missing");
      return;
    }
  
    const item_update: ShoppingItemTypes = {
      ...selectedItem,
      selected: !selectedItem.selected,
      purchased: itemPurchase,
      modifiedDate: now,
      price: priceInput !== "0" ? priceInput : selectedItem.price,
      quantity: qtyVal !== "0" ? qtyVal : selectedItem.quantity,
      qtyUnit: qtyUnit !== "None" ? qtyUnit : selectedItem.qtyUnit,
      priority: priorityVal !== "None" ? priorityVal : selectedItem.priority,
      note: note.trim() !== "" ? note : selectedItem.note,
      key: itemPurchase ? selectedItem.key+"purchased".toLowerCase():selectedItem.key
      // attachments: attachments.length > 0 ? JSON.stringify(attachments) : selectedItem.attachments,
    };
  
    await updateShoppingItemAndUpdateState(item_update);
    setShowItemInformationActionsheet(false);
  };

  const formatPriceInput = (input: string) => {
    // Remove any existing currency symbol and spaces
    const cleaned = input.replace(/[^0-9.]/g, "");

    // Check if it already contains a dot (user started typing decimals)
    const [intPart, decPart] = cleaned.split(".");

    // If there's no dot, just return the integer with £
    if (decPart === undefined) {
      if (!intPart) return "£ ";
      return `£ ${intPart}`;
    }

    // Limit decimal to 2 digits
    const limitedDec = decPart.slice(0, 2);
    return `£ ${intPart}.${limitedDec}`;
  };

  const handlePriceInputChange = (text: string) => {
    setPriceInput(text);
  };

  const handlePriceInputFocus = () => {
    if (priceInput === "0") {
      setPriceInput("");
    }
  };

  const handlePriceInputBlur = () => {
    if (priceInput.trim() === "") {
      setPriceInput("0");
    }
  };

  const handleMarkItemAsPurchased = () => {
    if (selectedItem?.selected) {
      
      setItemPurchase((prev) => !prev);
    } else {
      toast.show({
        id: `toast-${Date.now()}`,
        placement: "bottom",
        duration: 5000,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            <ToastTitle>Selection Required</ToastTitle>
            <ToastDescription>
              Please select the item before marking it as purchased.
            </ToastDescription>
          </Toast>
        ),
      });
    }
  };

  const handleUpdateQuantity = async (key: string, change: number) => {
    console.log("Quantity change:", change);

    const lastQty = qtyVal ?? selectedItem?.quantity ?? 1;
    const newQty = Math.max(1, Number(lastQty) + change);

    console.log("Previous Quantity:", lastQty);
    console.log("New Quantity:", newQty);

    SetQtyVal(String(newQty));
  };

  const HandleSetNote = async (note: string) => {
    console.log(note);
    setNote(note);
  };

  const handleSelect = (key:string) => {
    console.log("key = " + key)
    if (key === '0') setActionType('camera');
    else if (key === '1') setActionType('scan');
    else if (key === '2') setActionType('library');
  };

  const handleClose = () => {
    setShowActionsheet(false);
    setActionType("none");
  };

  // const handleAttachment = (attachment: AttachmentParam) => {
  //   console.log("attachment")
  //   console.log(attachment)
  //   setAttachment(attachment);
  //   handleClose();
  // };

  const handleAttachment = (newAttachment: AttachmentParam) => {
    setAttachments(prev => [...prev, newAttachment]);
    handleClose();
  };

  const handlePress = (selectedItem : ShoppingItemTypes, catalogItem: CategoryItemResponseType) => {
    sheetRef.current?.open(selectedItem, catalogItem); // ✅ opens the sheet from anywhere
  };

  return (
    <Pressable onPress={() => setShowModal(true)}>
      {/* <ShoppingListCheckboxRow
          shoppingList={shoppingList}
          isChecked={isChecked}
          handleCheckboxChange={handleCheckboxChange}
          selectedItem={selectedItem}
          onShowInfo={handleShowItemInformationActionsheet}
        /> */}
      {/* <ItemInformationSheet
        isOpen={showItemInformationActionsheet}
        onClose={handleItemInformationActionsheetClose}
        onDone={handleItemInformationActionsheetUpdate}
        shoppingList={shoppingList}
        isChecked={isChecked}
        handleCheckboxChange={handleCheckboxChange}
        itemPurchase={itemPurchase}
        handleMarkItemAsPurchased={handleMarkItemAsPurchased}
        priceInput={priceInput}
        handlePriceInputChange={handlePriceInputChange}
        handlePriceInputBlur={handlePriceInputBlur}
        handlePriceInputFocus={handlePriceInputFocus}
        note={note}
        HandleSetNote={HandleSetNote}
        qtyVal={qtyVal}
        handleUpdateQuantity={handleUpdateQuantity}
        qtyUnit={qtyUnit}
        SetQtyUnit={SetQtyUnit}
        qtyOptions={qtyOptions}
        priorityVal={priorityVal}
        setPriorityVal={setPriorityVal}
        setAttachments={setAttachments}
        priorityOption={priorityOption}
        showActionsheet={showActionsheet}
        handleClose={handleClose}
        handleSelect={handleSelect}
        actionType={actionType}
        attachments={attachments}
        handleAttachment={handleAttachment}
        isOpenDiscardSheet={showDiscardConfirmation}
        handleDiscard={handleDiscard}
        handleDiscardConfirmationSheet={() => setShowDiscardConfirmation(false)}
        handleRemoveAttachment={handleRemoveAttachment}
        handleUpdateItems={handleUpdateItems}
      /> */}
      <ShoppingListCheckboxRow
          shoppingList={shoppingList}
          isChecked={isChecked}
          handleCheckboxChange={handleCheckboxChange}
          selectedItem={selectedItem}
          onShowInfo={() => {
            if (selectedItem) {
              handlePress(selectedItem, shoppingList);
            }
          }}
        />
       <ItemInformationSheetController ref={sheetRef} />
    </Pressable>
  );
}

const styles = StyleSheet.create({});

//TODO
// Work on when am item is bought what is expected
//Work on adding new entry
// Troobleshoot while if the number of entry for a given item is greater than 1. When you click on uncheck, it removes it from the item individual list and live selected for the formal item as true.
