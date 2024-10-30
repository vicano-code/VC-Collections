import redisClient from '../utils/redis.js';
import dbClient from "../utils/db.js";
import { ObjectId } from 'mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class CheckoutController {

  static async checkoutSession(req, res) {
    const { cartItems, token } = req.body;
    console.log(cartItems);
    console.log(token);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "No order data provided" });
    }

    // Proceed to stripe checkout
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
            },
            unit_amount: item.price * 100, // convert to cents
          },
          quantity: item.qty
        })),
        mode: "payment",
        success_url: `http://localhost:3000`,
        cancel_url: "http://localhost:3000/cancel",
        metadata: { token: token }, // Store the token in metadata for use in processWebhookEvents method
      });

      res.json({ sessionId: session.id });
      
    } catch (error) {
      console.error("Stripe error:", error.message);
      res.status(500).json({ error: `checkout session creation failed: ${error}` });
    }
  }

  // Receive stripe session webhook events data and update user orderHistory in DB
  // Handle Webhook events for local testing with a tool like ngrok
  static async processWebhookEvents(req, res) {
    let event;

    // Verify the webhook signature
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return res.sendStatus(400); // Return 400 Bad Request
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        // Access the redis user token from the session metadata
        const token = session.metadata.token;
        console.log(token);

        // Fetch line items from the session in stripe using the session_id from webhook
        let orderData = []; // Initialize an empty array to store order data

        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          console.log(lineItems);

          lineItems.data.forEach((item) => {
            orderData.push({
              stripeSessionId: session.id,
              itemId: item.id,
              Item_name: item.description,
              Quantity: item.quantity,
              Price: item.amount_total / 100, // convert to usd
              currency: item.currency,
              paymentStatus: session.payment_status,
              date: new Date(Date.now()).toLocaleString()
            });
          });
          console.log(orderData)
        } catch (error) {
          console.error("Error fetching line items:", error);
          return res.status(500).send("Error fetching line items:", error);
        }
        
        // Update user order history
        try {
          const userId = await redisClient.get(token);
          console.log(userId);
          if (userId) {
            const user = await dbClient.users.findOne({ _id: new ObjectId(userId) });
            if (user) {
              const updatedOrderHistory = [...(user.orderHistory || []), ...orderData];
              const update = { $set: { orderHistory: updatedOrderHistory } };

              await dbClient.users.updateOne({ _id: new ObjectId(userId) }, update);
              console.log("Order history updated successfully");
            }
          }
        } catch (error) {
          console.error("Error updating order history:", error);
        }

        break;

      // Handle other event types if necessary
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    res.json({ received: true });
  }
}

export default CheckoutController;
