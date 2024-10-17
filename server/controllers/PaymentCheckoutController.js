const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentCheckoutController {
  static async processPayment(req, res) {
    const { orderItems } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: orderItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: orderItems.name,
            },
            unit_amount: orderItems.price * 100, // Convert to cents
          },
          quantity: orderItems.quantity,
        })),
        mode: "payment",
        //success_url: "http://localhost:3000/success",
        //cancel_url: "http://localhost:3000/cancel",
      });

      res.json({ id: session.id });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = PaymentCheckoutController;
