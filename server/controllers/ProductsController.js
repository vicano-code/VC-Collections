const dbClient = require('../utils/db');

class ProductsController {
  static async getAllProducts(request, response) {
    try {
      const data = await dbClient.products.find().toArray();
      response.status(200).send(data);
    } catch (error) {
      response.status(500).send(`Error retrieving products: ${error.message}`);
    }
  }
  
  static async getProductById(request, response) {
    const id = request.params.id; // Access the product ID from params

    try {
      const product = await dbClient.products.findOne({ _id: id }); // Query the database for the product
      if (!product) {
        return response.status(404).send(`Product with ID ${id} not found`);
      }
      response.status(200).json(product); // Return the found product
    } catch (error) {
      response.status(500).send(`Error retrieving product: ${error.message}`);
    }
  }
}

module.exports = ProductsController;
