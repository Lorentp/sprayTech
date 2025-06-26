const Product = require("../models/product.model");

class ProductManager {
  // Crear un producto
  async createProduct(productData) {
    try {
      const product = await Product.create({
        owner: productData.owner,
        name: productData.name,
        type: productData.type,
        price: productData.price,
      });
      return product;
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Modificar un producto
  async updateProduct(productId, ownerId, updateData) {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: productId, owner: ownerId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (!product) {
        throw new Error("Producto no encontrado o no pertenece al usuario");
      }
      return product;
    } catch (error) {
      throw new Error(`Error al modificar producto: ${error.message}`);
    }
  }

  // Eliminar un producto
  async deleteProduct(productId) {
    try {
      const product = await Product.findOneAndDelete({
        _id: productId,
      });
      if (!product) {
        throw new Error("Producto no encontrado o no pertenece al usuario");
      }
      return { message: "Producto eliminado correctamente" };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  //Get Products
  async getProducts(owner) {
    try {
      const ownerId = owner._id || owner;
      const products = await Product.find({ owner: ownerId }).lean();
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductManager();
