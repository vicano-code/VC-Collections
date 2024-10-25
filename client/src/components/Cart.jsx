//import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import Checkout from './checkout';
import "../styles/Cart.css";

const Cart = () => {
  // Extract data from redux state
  const state = useSelector((state) => state.handleCart);

  // redux actions to add or delete item from cart
  const dispatch = useDispatch();

  // function to increment product quantity in cart
  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  // function to decrement product quantity in cart
  const delProduct = (product) => {
    dispatch(delCart(product));
  };

  // Compute total price of items in cart
  const totalPrice = () => {
    let totalAmt = state.reduce(
      (accumulator, item) => accumulator + item.price * item.qty,
      0
    );
    return parseFloat(totalAmt.toFixed(2));
  };

  return (
    <div id='cart'>
      <p>{new Date(Date.now()).toUTCString()}</p>
      <h6>Item List</h6>
      <table
        id="myTable"
        style={{ fontFamily: "sans-serif", fontSize: "small" }}
      >
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
        {state.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.qty}</td>
            <td>$ {item.price}</td>
            <td>
              <button onClick={() => addProduct(item)} className="cartBtn">
                +
              </button>
            </td>
            <td>
              <button onClick={() => delProduct(item)} className="cartBtn">
                -
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <b>Total Cost</b>
          </td>
          <td>
            <b>$ {totalPrice()}</b>
          </td>
        </tr>
        </tbody>
      </table>
      <br />
      <Checkout cartItems={state} />
    </div>
  );
};

export default Cart;
