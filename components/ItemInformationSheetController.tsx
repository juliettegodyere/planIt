// components/ItemInformationSheetController.tsx

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ItemInformationSheet from "./ItemInformationSheet";
import { CategoryItemResponseType, ShoppingItemTypes } from "@/service/types";
import { checkboxControlActions } from "@/hooks/checkboxControlActions";
import { useSQLiteContext } from "expo-sqlite";
import { useShoppingActions } from "@/db/Transactions";
import { useShoppingListContext } from "@/service/store";
import { ActionType, AttachmentParam } from "./type";
import { priorityOption, qtyOptions } from "@/data/dataStore";
import { useToast } from "./ui/toast";
import { showToast } from "@/Util/toastUtils";

export type ItemInformationSheetHandle = {
  close: () => void;
  open: (
    item: ShoppingItemTypes,
    catalogItem: CategoryItemResponseType
  ) => void;
};

const ItemInformationSheetController = forwardRef<ItemInformationSheetHandle>(
  (_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shoppingList, setShoppingList] =
      useState<CategoryItemResponseType | null>(null);
    const [priceInput, setPriceInput] = useState("0");
    const [itemPurchase, setItemPurchase] = useState(false);
    const [qtyVal, SetQtyVal] = useState("1");
    const [qtyUnit, SetQtyUnit] = useState("None");
    const [priorityVal, setPriorityVal] = useState("None");
    const [note, setNote] = useState("");
    const [attachments, setAttachments] = useState<AttachmentParam[]>([]);
    const [actionType, setActionType] = useState<ActionType | null>("none");
    const [showActionsheet, setShowActionsheet] = useState(false);
    const toast = useToast();
    const [showDiscardConfirmation, setShowDiscardConfirmation] =
      useState(false);
    const [selectedItem, setSelectedItem] = useState<ShoppingItemTypes | null>(
      null
    );
  
    const db = useSQLiteContext();
    const {
      addNewItemToShoppingItemsAndUpdateState,
      updateShoppingItemAndUpdateState,
    } = useShoppingActions();
    const { state, dispatch } = useShoppingListContext();
    const { isChecked, handleCheckboxChange } = checkboxControlActions(
      db,
      state,
      dispatch,
      addNewItemToShoppingItemsAndUpdateState,
      updateShoppingItemAndUpdateState
    );

    useImperativeHandle(ref, () => ({
      open: (item, catalogItem) => {
        setSelectedItem(item);
        setShoppingList(catalogItem);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }));

    const initialValuesRef = useRef({
        priceInput,
        itemPurchase,
        qtyVal,
        qtyUnit,
        priorityVal,
        note,
        attachments,
      });

    useEffect(() => {
        if (actionType) {
          setShowActionsheet(actionType !== 'none');
        }
      }, [actionType]);
    
      useEffect(() => {
        if (isOpen) {
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
      }, [isOpen]);

    const handleMarkItemAsPurchased = () => {
      if (selectedItem?.selected) {
        setItemPurchase((prev) => !prev);
      }else{
        showToast(toast, {
            title: "Selection Required",
            description: "Please select the item before marking it as purchased.",
            action: "error",
          });
      }
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

    const handleUpdateQuantity = async (key: string, change: number) => {
      const lastQty = qtyVal ?? selectedItem?.quantity ?? 1;
      const newQty = Math.max(1, Number(lastQty) + change);

      SetQtyVal(String(newQty));
    };

    const handleClose = () => {
      setShowActionsheet(false);
      
      setActionType("none");
    };

    const handleSelect = (key: string) => {
      console.log("key = " + key);
      if (key === "0") setActionType("camera");
      else if (key === "1") setActionType("scan");
      else if (key === "2") setActionType("library");
    };

    const handleAttachment = (newAttachment: AttachmentParam) => {
      setAttachments((prev) => [...prev, newAttachment]);
      handleClose();
    };

    const handleDiscard = () => {
      setPriceInput("£ ");
      setItemPurchase(false);
      SetQtyVal("1");
      SetQtyUnit("None");
      setPriorityVal("None");
      setNote("");
      setAttachments([]);
      setIsOpen(false);
      setShowDiscardConfirmation(false);
    };

    const handleRemoveAttachment = (index: number) => {
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateItems = async () => {
      const now = new Date().toISOString();

      if (!selectedItem?.id) {
        console.error("Cannot update item: ID is missing");
        return;
      }

      const item_update: ShoppingItemTypes = {
        ...selectedItem,
        selected: itemPurchase? !selectedItem.selected : selectedItem.selected,
        purchased: itemPurchase,
        modifiedDate: now,
        price: priceInput !== "0" ? priceInput : selectedItem.price,
        quantity: qtyVal !== "0" ? qtyVal : selectedItem.quantity,
        qtyUnit: qtyUnit !== "None" ? qtyUnit : selectedItem.qtyUnit,
        priority: priorityVal !== "None" ? priorityVal : selectedItem.priority,
        note: note.trim() !== "" ? note : selectedItem.note,
        key: itemPurchase
          ? selectedItem.key + "purchased".toLowerCase()
          : selectedItem.key,
        // attachments: attachments.length > 0 ? JSON.stringify(attachments) : selectedItem.attachments,
      };

      await updateShoppingItemAndUpdateState(item_update);
      setIsOpen(false);
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

    const handleItemInformationActionsheetClose = () => {
        if (hasChanges()) {
          setShowDiscardConfirmation(true);
        } else {
            setIsOpen(false);
        }
      };

       // ✅ Now it's safe to return null conditionally
    if (!shoppingList) return null;

    return (
      <ItemInformationSheet
        isOpen={isOpen}
        onClose={handleItemInformationActionsheetClose}
        onDone={() => {}}
        shoppingList={shoppingList}
        selectedItem={selectedItem}
        // TEMP: add default/fallback props
        isChecked={isChecked}
        handleCheckboxChange={handleCheckboxChange}
        itemPurchase={itemPurchase}
        handleMarkItemAsPurchased={handleMarkItemAsPurchased}
        priceInput={priceInput}
        handlePriceInputChange={setPriceInput}
        handlePriceInputBlur={handlePriceInputBlur}
        handlePriceInputFocus={handlePriceInputFocus}
        note={note}
        HandleSetNote={setNote}
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
      />
    );
  }
);

export default ItemInformationSheetController;
