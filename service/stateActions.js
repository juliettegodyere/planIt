export const addItem = (item) => ({
    type: "ADD_ITEM",
    payload: item,
  });

  export const updateItem = (id, item) => ({
    type: "UPDATE_ITEM",
    payload: {id, item},
  });

  export const addNewEntry = (item) => ({
    type: "ADD_NEW_ENTRY",
    payload: {item},
  });
  
  export const removeItem = (id) => ({
    type: "REMOVE_ITEM",
    payload: id,
  });
  
  export const updateQuantity = (id, change) => ({
    type: "UPDATE_QUANTITY",
    payload: { id, change },
  });
  
  export const updatePrice = (id, price) => ({
    type: "UPDATE_PRICE",
    payload: { id, price },
  });

  export const updatePriority = (id, priority) => ({
    type: "UPDATE_PRIORITY",
    payload: { id, priority },
  }); 
  
  export const updateUnit = (id, unit) => ({
    type: "UPDATE_UNIT",
    payload: { id, unit },
  });

  export const updatePurchase = (id) => ({
    type: "UPDATE_PURCHASE",
    payload: { id },
  });

  export const updateSelected = (id) => ({
    type: "UPDATE_SELECTED",
    payload: { id },
  });

  export const setSearchQuery = (query) => ({
    type: "SET_SEARCH_QUERY",
    payload: query,
  });
  
  export const toggleFilter = () => ({
    type: "TOGGLE_FILTER",
  });
  
  export const toggleSelectionOrder = () => ({
    type: "TOGGLE_SELECTION_ORDER",
  });
  
  export const setSelectedCategory = (category) => ({
    type: "SET_SELECTED_CATEGORY",
    payload: category,
  }); 

  export const updateUser = (id, item) => ({
    type: "UPDATE_USER",
    payload: {id, item},
  }); 
  

  