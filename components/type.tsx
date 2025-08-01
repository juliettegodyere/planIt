import { CategoryItemResponseType, ShoppingItemTypes, guestUserType } from "@/service/types";

//export type ActionType = 'none' | 'camera' | 'scan' | 'library';
export type ActionType = 'none' | 'camera' | 'library';

export type MenuItem = {
    label: string;
    value: string;
  };

export type AttachmentType = 'image' | 'text';

export interface AttachmentParam {
    type: AttachmentType;
    data: string; // could be a URI (for image) or text (for scanned doc)
  }

export interface ItemInformationSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onDone: () => void;
    shoppingList: CategoryItemResponseType;
    selectedItem: ShoppingItemTypes | null;
    isChecked: (value: string) => boolean;
    handleCheckboxChange: (item: CategoryItemResponseType) => void;
    itemPurchase: boolean;
    handleMarkItemAsPurchased: () => void;
    priceInput: string;
    handlePriceInputChange: (text: string) => void;
    handlePriceInputBlur: () => void;
    handlePriceInputFocus: () => void;
    note: string;
    HandleSetNote: (text: string) => void;
    qtyVal: string;
    handleUpdateQuantity: (value: string, delta: number) => void;
    qtyUnit: string;
    SetQtyUnit: (unit: string) => void;
    qtyOptions: string[];
    priorityVal: string;
    setAttachments: React.Dispatch<React.SetStateAction<AttachmentParam[]>>;
    setPriorityVal: (priority: string) => void;
    priorityOption: string[];
    showActionsheet: boolean;
    handleClose: () => void;
    handleSelect: (key: string) => void;
    actionType: ActionType | null;
    attachments: AttachmentParam[];
    handleAttachment: (attachment: AttachmentParam) => void;
    isOpenDiscardSheet:boolean;
    handleDiscard: () => void;
    handleDiscardConfirmationSheet: () => void;
    handleRemoveAttachment: (key: number) => void;
    handleUpdateItems: () => void;
    reminderDate: string;
    setReminderDate: (date: string) => void;
    reminderTime: string;
    setReminderTime: (date: string) => void;
    isReminderTimeEnabled: boolean;
    setIsReminderTimeEnabled: (flag: boolean) => void;
    isReminderDateEnabled: boolean;
    setIsReminderDateEnabled: (flag: boolean) => void
    earlyReminder: string;
    setEarlyReminder: (val: string) => void;
    repeatReminder: string;
    setRepeatReminder: (val: string) => void;
    guest:guestUserType | null
  }