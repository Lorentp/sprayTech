const mongoose = require("mongoose");

// Subesquema para productos (reutilizable)
const productItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "La cantidad debe ser mayor o igual a cero"],
  },
  unit: {
    type: String,
    required: true,
  },
});

const recipeItemSchema = new mongoose.Schema({
  tanks: {
    type: Number,
    required: true,
    min: [0.001, "El número de tancadas debe ser mayor a 0"],
  },
  lts_x_ha: {
    type: Number,
    required: true,
    min: [0, "Los litros por hectárea deben ser mayores o iguales a cero"],
  },
  liters_per_tank: {
    type: Number,
    required: true,
    min: [0, "Los litros por tanque deben ser mayores o iguales a cero"],
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  products_per_ha: {
    type: [productItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Debe haber al menos un producto por hectárea",
    },
  },
  products_per_tank: {
    type: [productItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Debe haber al menos un producto por tancada",
    },
  },
  products_total: {
    type: [productItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "Debe haber al menos un producto en total",
    },
  },
});

const recipeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Field",
    required: true,
  },
  ha: {
    type: Number,
    required: true
  },
  recipe: {
    type: [recipeItemSchema],
    required: true,
    validate: {
      validator: (arr) => arr.length > 0,
      message: "La receta debe contener al menos un ítem",
    },
  },
  date: {
    type: Date,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
    min: [0, "El costo total debe ser mayor o igual a cero"],
  },
  costPerHa: {
    type: Number,
    required: true,
    min: [0, "El costo por hectárea debe ser mayor o igual a cero"],
  },
});

const RecipeModel = mongoose.model("Recipe", recipeSchema);

module.exports = RecipeModel;
