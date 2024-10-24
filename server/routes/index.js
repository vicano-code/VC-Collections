const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const UsersController = require('../controllers/UsersController');
const CheckoutController = require('../controllers/CheckoutController');

const router = express.Router();

// Define routes
router.get ('/products', ProductsController.getAllProducts);
router.get ('/products/:id', ProductsController.getProductById);
router.post ('/products/create', ProductsController.createProduct);

router.post('/users/login', UsersController.loginUser);
router.post('/users/register', UsersController.addNewUser);

router.post('/cart/checkout', CheckoutController.checkoutSession);
router.post('/webhook', CheckoutController.processWebhookEvents);

module.exports = router;
