import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(key);

const Checkout = ({ cartItems }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckoutBtn = async () => {
    const stripe = await stripePromise;
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage("Please Login to checkout");
      return
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/cart/checkout",
        { cartItems, token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!(response.status === 200)) {
        console.error("Failed to create checkout session");
        return
      }
      const session_id = await response.data.sessionId;

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        console.log("payment processing failed");
      }

    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <>
      <button
        className="btn btn-outline-dark me-2"
        id="checkoutBtn"
        role="link"
        onClick={handleCheckoutBtn}
      >
        Checkout
      </button>
      <br />
      <p style={{color: 'red'}}>{errorMessage}</p>
    </>
  );
};

export default Checkout;
