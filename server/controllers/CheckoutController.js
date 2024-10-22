const dbClient = require('../utils/db');
// const redisClient = require('../utils/redis');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


class CheckoutController {

  static async checkout(req, res) {
    // Retrieve the user from the redis token
    const token = req.headers['x-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);
    if (!userId) return res.status(401).json({ error: 'Please Login or Sign Up to continue' });
    try {
      let user = await dbClient.users.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found')
      }
    } catch (error) {
      
    }
  }

  static async processPayment(req, res) {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'No order data provided' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
            },
            unit_amount: item.price * 100, // Convert to cents
          },
          quantity: item.qty,
        })),
        mode: "payment",
        success_url: "http://localhost:3001/success",
        cancel_url: "http://localhost:3001/cancel",
      });
      res.json({ id: session.id });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  }
}

module.exports = CheckoutController;
