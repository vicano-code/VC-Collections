const dbClient = require("../utils/db");
const { ObjectId } = require("mongodb");

class ProductsController {
  // Create new product
  static async createProduct(request, response) {
    const newProduct = {
      id: request.body.id,
      title: request.body.title,
      price: request.body.price,
      description: request.body.description,
      category: request.body.category,
      image: request.body.image,
      rating: request.body.rating,
    };

    try {
      await dbClient.products.create(newProduct);
      response.send("Product saved to database");
    } catch (error) {
      response.send(`Error creating product: ${error.message}`);
    }
  }

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
      return response.status(400).send("Invalid product ID");
    }

    try {
      const product = await dbClient.products.findOne({
        _id: new ObjectId(productId),
      });
      if (product) {
        response.status(200).send(product);
      } else {
        response.status(404).send("Product not found"); // Handle case where product doesn't exist
      }
    } catch (error) {
      response.status(500).send(`Error retrieving product: ${error.message}`);
    }
  }

  // Delete product from database
  static async deleteProduct(request, response) {
    const productId = request.params.id;
    try {
      await dbClient.products.findOneAndDelete({ _id: productId });
      response.status(200).send("Product deleted successfully");
    } catch (error) {
      response.status(500).send(`Error deleting product: ${error.message}`);
    }
  }
}

module.exports = ProductsController;
