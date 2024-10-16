import { ADD_ITEM, REMOVE_ITEM } from "../action";

const cart = [];

const handleCart = (state = cart, action) => {
  const product = action.payload;
  switch (action.type) {
    case ADD_ITEM:
      //Check if product is already on cart
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Increase the quantity
        return state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        const product = action.payload;
        return [...state, { ...product, qty: 1 }];
      }

    case REMOVE_ITEM:
        const exist1 = state.find((x) => x.id === product.id);
        if (exist1 === null) {
          return
        }
        if (exist1.qty === 1) {
          return state.filter((x) => x.id !== exist1.id);
        } else {
          return state.map((x) =>
            x.id === product.id ? { ...x, qty: x.qty - 1 } : x
          );
        }

    default:
      return state;
  }
};

export default handleCart;
