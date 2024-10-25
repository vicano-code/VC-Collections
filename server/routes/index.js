const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const AuthController = require('../controllers/AuthController');
const UsersController = require('../controllers/UsersController');
const CheckoutController = require('../controllers/CheckoutController');

const router = express.Router();

// Define routes
router.get ('/products', ProductsController.getAllProducts);
router.get ('/products/:id', ProductsController.getProductById);
router.post ('/products/create', ProductsController.createProduct);

router.post('/users/login', AuthController.loginUser);
router.post('/users/register', AuthController.addNewUser);

router.post('/cart/checkout', CheckoutController.checkoutSession);
router.post('/webhook', CheckoutController.processWebhookEvents);

router.get('/users', UsersController.getAllUsers);
router.post('/admin/login', UsersController.loginAdmin);

module.exports = router;
