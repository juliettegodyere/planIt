// types.ts

export interface ShoppingItemTypes {
    id:string;
    key: string;
    name: string;
    quantity: string;
    qtyUnit: string;
    price: string;
    purchased: boolean;
    selected: boolean;
    createDate: string;
    modifiedDate: string;
    priority: string;
    category_item_id: string;
    note: string;
    attachments:string;
    reminderDate: string
    reminderTime: string
    isReminderTimeEnabled: boolean;
    isReminderDateEnabled: boolean;
    earlyReminder: string;
    repeatReminder: string;
  }

  export interface CreateShoppingItemTypes {
    key: string;
    name: string;
    quantity: string;
    qtyUnit: string;
    price: string;
    purchased: boolean;
    selected: boolean;
    createDate: string;
    modifiedDate: string;
    priority: string;
    category_item_id: string;
    note: string;
    attachments:string;
    reminderDate: string
    reminderTime: string
    isReminderTimeEnabled: boolean;
    isReminderDateEnabled: boolean;
    earlyReminder: string;
    repeatReminder: string;
  }

export type CategoriesType = {
  id: string;
  label: string;
  value: string;
};

export type CategoryItemTypes = {
  id: string;
  label: string;
  value: string;
  category_id: string; 
};

export interface CategoryItemResponseType  {
  label: string;
  value: string;
  category:string;
}

export interface guestUserType  {
  id: string,
  name: string,
  createdAt: string,
  country: string,
  currencyCode: string,
  currencySymbol: string,
}

export interface FullCategoryItem {
  id: string;
  label: string;
  value: string;
  categoryLabel: string;
}



  