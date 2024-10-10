const dbClient = require('../utils/db');
const { ObjectId } = require('mongodb');

class ProductsController {
  // Fetch all products from the database
  static async getAllProducts(request, response) {
    try {
      const data = await dbClient.products.find().toArray();
      response.status(200).send(data);
    } catch (error) {
      response.status(500).send(`Error retrieving products: ${error.message}`);
    }
  }

  // Fetch a product by ID from the database
  static async getProductById(request, response) {
    const productId = request.params.id;

    // Ensure valid ObjectId format
    if (!ObjectId.isValid(productId)) {
      return response.status(400).send('Invalid product ID');
    }

    try {
      const product = await dbClient.products.findOne({ _id: new ObjectId(productId) });
      if (product) {
        response.status(200).send(product);
      } else {
        response.status(404).send("Product not found"); // Handle case where product doesn't exist
      }
    } catch (error) {
      response.status(500).send(`Error retrieving product: ${error.message}`);
    }
  }
}

module.exports = ProductsController;
