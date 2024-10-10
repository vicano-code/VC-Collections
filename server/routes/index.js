const express = require('express');
const ProductsController = require('../controllers/ProductsController');

const router = express.Router();
//const productsController = new ProductsController();
// Define routes
router.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
router.get ('/products', ProductsController.getAllProducts);
router.get ('/products/:id', ProductsController.getProductById);

module.exports = router;
