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
    </>
  )
}

export default UserAccount;
