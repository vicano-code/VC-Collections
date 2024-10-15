export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

//For Add Item to Cart
export const addCart = (product) => {
  return {
      type: "ADD_ITEM",
      payload: product
  }
}

//For Delete Item From Cart
export const delCart = (product) => {
  return {
      type: "REMOVE_ITEM",
      payload: product
  }
}