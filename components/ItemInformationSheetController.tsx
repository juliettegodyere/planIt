// components/ItemInformationSheetController.tsx

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
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
import { generateSimpleUUID } from "@/Util/HelperFunction";
import { DEFAULTS } from "@/Util/constants/defaults";

export type ItemInformationSheetHandle = {
  close: () => void;
  open: (
    item: ShoppingItemTypes,
    catalogItem: CategoryItemResponseType
  ) => void;
};

const ItemInformationSheetController = forwardRef<ItemInformationSheetHandle>(
  (_, ref) => {
    const now = new Date();
    const [isOpen, setIsOpen] = useState(false);
    const [shoppingList, setShoppingList] =
      useState<CategoryItemResponseType | null>(null);
    const [priceInput, setPriceInput] = useState(DEFAULTS.PRICE);
    const [itemPurchase, setItemPurchase] = useState(DEFAULTS.IS_PURCHASED);
    const [qtyVal, SetQtyVal] = useState(DEFAULTS.QUANTITY);
    const [qtyUnit, SetQtyUnit] = useState(DEFAULTS.NONE);
    const [priorityVal, setPriorityVal] = useState(DEFAULTS.NONE);
    const [note, setNote] = useState(DEFAULTS.EMPTY);
    const [reminderDate, setReminderDate] = useState(DEFAULTS.EMPTY);
    const [reminderTime, setReminderTime] = useState(DEFAULTS.EMPTY);
    const [isReminderTimeEnabled, setIsReminderTimeEnabled] =
      useState<boolean>(DEFAULTS.IS_REMINDER_ENABLED);
    const [isReminderDateEnabled, setIsReminderDateEnabled] =
      useState<boolean>(DEFAULTS.IS_REMINDER_ENABLED);
    const [earlyReminder, setEarlyReminder] = useState(DEFAULTS.NONE);
    const [repeatReminder, setRepeatReminder] = useState(DEFAULTS.REPEAT_NEVER);
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
      deleteShoppingItemAndUpdateState,
    } = useShoppingActions();
    const { state, dispatch } = useShoppingListContext();
    const { isChecked, handleCheckboxChange } = checkboxControlActions(
      db,
      state,
      dispatch,
      addNewItemToShoppingItemsAndUpdateState,
      updateShoppingItemAndUpdateState,
      deleteShoppingItemAndUpdateState
    );

    useImperativeHandle(ref, () => ({
      open: (item, catalogItem) => {
        setSelectedItem(item);
        setShoppingList(catalogItem);

        if(item){
          applySelectedItemValues(item)
        }

        // ✅ Assign once before opening UI
        initialValuesRef.current = {
          priceInput,
          itemPurchase,
          qtyVal,
          qtyUnit,
          priorityVal,
          note,
          attachments,
          reminderDate,
          reminderTime,
          isReminderTimeEnabled,
          isReminderDateEnabled,
          earlyReminder,
          repeatReminder,
        };

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
      reminderDate,
      reminderTime,
      isReminderTimeEnabled,
      isReminderDateEnabled,
      earlyReminder,
      repeatReminder,
    });

    useEffect(() => {
      if (actionType) {
        setShowActionsheet(actionType !== "none");
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
          reminderDate,
          reminderTime,
          isReminderTimeEnabled,
          isReminderDateEnabled,
          earlyReminder,
          repeatReminder,
        };
      }
    }, [isOpen]);

    useEffect(() => {
      if (!selectedItem?.id) return;

      const updatedItem = state.shoppingItemLists.find(
        (item) => item.id === selectedItem.id
      );
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    }, [state.shoppingItemLists, selectedItem]);

    const applySelectedItemValues = (item: ShoppingItemTypes) => {
      const {price,purchased,quantity,qtyUnit,priority,note,reminderDate,reminderTime,isReminderTimeEnabled,isReminderDateEnabled,earlyReminder,repeatReminder,attachments
      } = item;
      setPriceInput(price);
      setItemPurchase(purchased); 
      SetQtyVal(quantity);
      SetQtyUnit(qtyUnit);
      setPriorityVal(priority);
      setNote(note || DEFAULTS.EMPTY);
      setAttachments(attachments ? JSON.parse(item.attachments) : []);
      setReminderTime(reminderTime || DEFAULTS.EMPTY);
      setReminderDate(reminderDate || DEFAULTS.EMPTY);
      setIsReminderTimeEnabled(isReminderTimeEnabled);
      setIsReminderDateEnabled(isReminderDateEnabled);
      setEarlyReminder(earlyReminder);
      setRepeatReminder(repeatReminder);
    };    

    const handleMarkItemAsPurchased = () => {
      if (selectedItem?.selected) {
        setItemPurchase((prev) => !prev);
      } else {
        showToast(toast, {
          title: "Selection Required",
          description: "Please select the item before marking it as purchased.",
          action: "error",
        });
      }
    };

    const handlePriceInputFocus = () => {
      if (priceInput === DEFAULTS.PRICE) {
        setPriceInput(DEFAULTS.EMPTY);
      }
    };

    const handlePriceInputBlur = () => {
      if (priceInput.trim() === DEFAULTS.EMPTY) {
        setPriceInput(DEFAULTS.PRICE);
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
      // else if (key === "1") setActionType("scan");
      else if (key === "1") setActionType("library");
    };

    const handleAttachment = (newAttachment: AttachmentParam) => {
      setAttachments((prev) => [...prev, newAttachment]);
      handleClose();
    };

    const handleDiscard = () => {
      if (!selectedItem) return;

      applySelectedItemValues(selectedItem)

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
        // selected: itemPurchase ? !selectedItem.selected : selectedItem.selected,
        selected: itemPurchase ? false : selectedItem.selected,
        purchased: itemPurchase,
        modifiedDate: now,
        price: priceInput,
        quantity: qtyVal,
        qtyUnit: qtyUnit,
        priority: priorityVal,
        note: note.trim(),
        key: itemPurchase && !selectedItem.key.includes("purchased")
        ? selectedItem.key + "_purchased_" + await generateSimpleUUID()
        : selectedItem.key,
          attachments:
          attachments.length > 0
            ? JSON.stringify(attachments)
            : selectedItem.attachments,
        reminderDate: isReminderDateEnabled ? reminderDate : DEFAULTS.EMPTY,
        reminderTime: isReminderTimeEnabled ? reminderTime: DEFAULTS.EMPTY,
        isReminderDateEnabled:isReminderDateEnabled,
        isReminderTimeEnabled:isReminderTimeEnabled,
        earlyReminder:earlyReminder
        //repeatReminder: repeatReminder,
      };

      await updateShoppingItemAndUpdateState(item_update);
      const updated = state.shoppingItemLists.find(
        (i) => i.id === selectedItem.id
      );
      if (updated) {
        setSelectedItem(updated);
      }

      setIsOpen(false);
      if (itemPurchase) {
        setPriceInput(DEFAULTS.PRICE);
        setItemPurchase(false);
        SetQtyVal(DEFAULTS.QUANTITY);
        SetQtyUnit(DEFAULTS.NONE);
        setPriorityVal(DEFAULTS.NONE);
        setNote(DEFAULTS.EMPTY);
        setReminderDate(DEFAULTS.EMPTY);
        setReminderTime(DEFAULTS.EMPTY);
        setIsReminderTimeEnabled(DEFAULTS.IS_REMINDER_ENABLED);
        setIsReminderDateEnabled(DEFAULTS.IS_REMINDER_ENABLED);
        setEarlyReminder(DEFAULTS.NONE);
        setRepeatReminder(DEFAULTS.REPEAT_NEVER);
        setAttachments([]);
      }
    };

    const hasChanges = () => {
      console.log("initialValuesRef.current");
      console.log(initialValuesRef.current);
      const initial = initialValuesRef.current;
      return (
        priceInput !== initial.priceInput ||
        itemPurchase !== initial.itemPurchase ||
        qtyVal !== initial.qtyVal ||
        qtyUnit !== initial.qtyUnit ||
        priorityVal !== initial.priorityVal ||
        note !== initial.note ||
        reminderDate !== initial.reminderDate ||
        reminderTime !== initial.reminderTime ||
        isReminderTimeEnabled !== initial.isReminderTimeEnabled ||
        isReminderDateEnabled !== initial.isReminderDateEnabled ||
        earlyReminder !== initial.earlyReminder ||
        repeatReminder !== initial.repeatReminder ||
        JSON.stringify(attachments) !== JSON.stringify(initial.attachments)
      );
    };

    const handleItemInformationActionsheetClose = () => {
      console.log(
        "handleItemInformationActionsheetClose - closing the actionsheet"
      );
      if (hasChanges()) {
        setShowDiscardConfirmation(true);
      } else {
        setIsOpen(false);
      }
    };

    // ✅ Now it's safe to return null conditionally
    if (!shoppingList) return null;
    console.log("ItemInformationSheetController - reminderDate");
    console.log(reminderDate);
    console.log(reminderTime);
    //console.log(formatTime(reminderDate))
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
        reminderDate={reminderDate}
        setReminderDate={setReminderDate}
        reminderTime={reminderTime}
        setReminderTime={setReminderTime}
        isReminderTimeEnabled={isReminderTimeEnabled}
        setIsReminderTimeEnabled={setIsReminderTimeEnabled}
        isReminderDateEnabled={isReminderDateEnabled}
        setIsReminderDateEnabled={setIsReminderDateEnabled}
        earlyReminder={earlyReminder}
        setEarlyReminder={setEarlyReminder}
        repeatReminder={repeatReminder}
        setRepeatReminder={setRepeatReminder}
        guest={state.guest}
      />
    );
  }
);

export default ItemInformationSheetController;
