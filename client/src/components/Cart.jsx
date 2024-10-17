//import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import axios from "axios";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
    let totalAmt = state.reduce(
      (accumulator, item) => accumulator + item.price * item.qty,
      0
    );
    return parseFloat(totalAmt.toFixed(2));
  };

  const handleCheckout = async () => {
    // Extract cart table data 
    let table = document.getElementById("myTable");

    let orderData = []; // Initialize an array to hold the extracted data

    // Loop through each row, starting from the second row (index 1), to skip the header row
    for (let i = 1; i < table.rows.length - 1; i++) {
      let rowData = {}; // Initialize an object to store data for the current row
      let cells = table.rows[i].cells; // Get the cells of the current row
      
      // Store each cell's data in the rowData object with keys
      rowData.name = cells[0]?.innerText || '';
      rowData.quantity = parseInt(cells[1]?.innerText || '');
      rowData.price = parseFloat(cells[2]?.innerText.split(' ')[1] || ''); // remove $ sign

      // Add the rowData object to the orderData array
      orderData.push(rowData);
    }
    // console.log(orderData);

    // Next, send orderData to backend server for payment processing
    try {
      const response = await axios.post(
        "http://localhost:5000/cart/checkout",
        { orderData },
        { headers: { "Content-Type": "application/json" } }
      );
      const sessionId = response.data;
      if (!sessionId) {
        console.log('payment processing failed');
        return;
      }
    } catch {
      console.error('Internal Server Error');
    }

    // Send orderData to backendServer to Update user DB with order data
    try {
      await axios.post(
        "http://localhost:5000//users/addOrder",
        { orderData },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log('User order history updated');
    } catch {
      console.error('Internal Server Error');
    }

  };

  return (
    <div style={{ width: "50%", margin: "2rem auto" }}>
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
      <button
        className="btn btn-outline-dark me-2"
        onClick={() => handleCheckout()}
        style={{ width: "50%", margin: "2rem auto" }}
      >
        Checkout
      </button>
    </div>
  );
};

export default ItemList;
