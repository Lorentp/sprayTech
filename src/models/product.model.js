const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  type: { type: String },
  price: { type: Number },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
