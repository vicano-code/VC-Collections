import React from "react";
import { useLocation } from "react-router-dom";

const UserAccount = () => {
  const location = useLocation();
  const userData = location.state?.userData;
  return (
    <>
      <h5>Welcome {userData.user.name}</h5>
      <br />
      <h6>Order History</h6>
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
        {userData.orders.map((order) => (
          <tr>
            <td>{order.name}</td>
            <td>{order.qty}</td>
            <td>$ {order.price}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </>
  )
}

export default UserAccount;
