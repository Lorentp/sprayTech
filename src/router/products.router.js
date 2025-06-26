const express = require("express");
const router = express.Router();
const productManager = require("../managers/product.manager");

router.post("/new-product", async (req, res) => {
  try {
    const owner = req.session.user._id;
    const { name, type, price } = req.body;

    const newProduct = {
      name: name,
      type: type,
      price: parseFloat(price),
      owner: owner,
    };

    const product = await productManager.createProduct(newProduct);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error("Error al crear producto:", error);
  }
});

router.post("/update:cid", async (req, res) => {
  try {
    const owner = req.session.user?._id;
    if (!owner) {
      throw new Error("Usuario no autenticado");
    }
    const productId = req.params.cid;
    const { price } = req.body;

    const updateData = { price: parseFloat(price) };
    const updatedProduct = await productManager.updateProduct(
      productId,
      owner,
      updateData
    );

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/delete/:cid", async (req, res) => {
  try {
    const result = await productManager.deleteProduct(req.params.cid);

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    console.error("Error al crear producto:", error);
  }
});

module.exports = router;
