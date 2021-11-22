import React, { createContext, useReducer } from "react";

const initialState = {};

const cartContext = createContext(initialState);
const { Provider } = cartContext;

const CartProvider = ({ children }) => {
  const [cartState, cartDispatch] = useReducer((oldState, action) => {
    switch (action.type) {
      case "SET_CART": {
        return action.value;
      }
      case "CLEAR_CART": {
        return initialState;
      }
      case "ADD_TO_CART": {
        const newState = {
          items: [...oldState.items, action.value],
        };
        return newState;
      }
      case "REMOVE_FROM_CART": {
        const newItems = oldState.items.filter(
          (item) => item.productId !== action.value.productId
        );
        const newState = {
          items: [...newItems],
        };
        return newState;
      }
      case "CHANGE_QTY": {
        console.log("QTY IN THE REDUCER:", action.value.qty);
        const newItems = oldState.items.map((item) => {
          if (item.productId === action.value.productId) {
            item.qty = action.value.qty;
          }
          return item;
        });
        const newState = {
          items: [...newItems],
        };
        return newState;
      }
      default:
        throw new Error();
    }
  }, initialState);

  return <Provider value={{ cartState, cartDispatch }}>{children}</Provider>;
};

export { cartContext, CartProvider };
