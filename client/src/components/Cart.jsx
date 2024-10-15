//import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ItemList = () => {
  const state = useSelector((state) => state.handleCart);

  // redux actions to add or delete item from cart
  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const delProduct = (product) => {
    dispatch(delCart(product));
  };

  // Compute total price of items in cart
  const totalPrice = () => {
    let totalAmt = state.reduce((accumulator, item) => accumulator + (item.price*item.qty), 0);
    return totalAmt;
  }

  return (
    <div style={{width: '50%', margin: '2rem auto'}}>
      <p>{new Date(Date.now()).toUTCString()}</p>
      <h6>Item List</h6>
      <table style={{fontFamily: 'sans-serif', fontSize: 'small' }}>
        {state.map((item) => (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.qty}</td>
            <td>$ {item.price}</td>
            <td><button onClick={() => addProduct(item)} style={{border: '1px solid black', background: 'None'}}><FontAwesomeIcon icon="fa-solid fa-square-plus" /></button></td>
            <td><FontAwesomeIcon icon="fa-solid fa-square-minus" onClick={() => delProduct(item)}/></td>
          </tr>
        ))}
        <tr>
          <td><b>Total Cost</b></td>
          <td><b>$ {totalPrice()}</b></td>
        </tr>
      </table>
      <br />
      <button className="btn btn-outline-dark me-2" style={{width: '50%', margin: '2rem auto'}}>Checkout</button>
    </div>
  );
};

export default ItemList;
