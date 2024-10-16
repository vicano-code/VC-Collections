const express = require('express');
const ProductsController = require('../controllers/ProductsController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// Define routes
router.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
router.get ('/products', ProductsController.getAllProducts);
router.get ('/products/:id', ProductsController.getProductById);
router.post('/users/addUser', UsersController.addNewUser);

module.exports = router;
