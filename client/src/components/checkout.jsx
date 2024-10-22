import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import axios from "axios";

const key = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(key);

const Checkout = ({ cartItems }) => {  
  const handleCheckoutBtn = async () => {
    const stripe = await stripePromise;
    try {
      const response = await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
        console.log('payment processing failed');
      }
    } catch(error) {
      console.error('Internal Server Error', error.message);
    }
  };

  return (
    <button 
      className="btn btn-outline-dark me-2" 
      id='checkoutBtn' role='link' 
      onClick={handleCheckoutBtn}
    >
      Checkout
    </button>
  );
};

export default Checkout;
