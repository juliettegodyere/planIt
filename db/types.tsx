// types.ts

export interface ShoppingItemDB {
    id:string;
    key: string;
    name: string;
    quantity: string; // stringified JSON
    qtyUnit: string;
    price: string;
    purchased: string;
    selected: string;
    createDate: string;
    modifiedDate: string;
    priority: string;
    category: string;
  }

export type Category = {
  id: string;
  label: string;
  value: string;
};

export type CategoryItem = {
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



  