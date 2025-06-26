const express = require("express")
const router = express.Router()
const recipeManager = require("../managers/recipe.manager.js")
const Product = require("../models/product.model.js")
const mongoose = require("mongoose")

module.exports = router


router.post("/new-recipe", async (req, res) => {
  try {
    if (!req.session.login || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ success: false, message: "Sesión terminada, vuelva a iniciar sesión" });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: `Cuerpo de la solicitud vacío: ${JSON.stringify(req.body)}` });
    }
    const owner = req.session.user._id;
    const { field, date, maxTank, lts_x_ha, products_per_ha, totalCost, costPerHa, ha } = req.body;

    // Validar datos
    if (!field || !date || !maxTank || !lts_x_ha || !products_per_ha || !ha) {
      return res.status(400).json({ success: false, message: `Faltan datos requeridos: ${JSON.stringify({ field, date, maxTank, lts_x_ha, products_per_ha, ha })}` });
    }

    // Validar ObjectId
    if (!mongoose.isValidObjectId(field)) {
      return res.status(400).json({ success: false, message: "El campo field debe ser un ObjectId válido" });
    }

    // Validar que products_per_ha sea un objeto o array
    if (!Array.isArray(products_per_ha) && typeof products_per_ha !== "object") {
      return res.status(400).json({ success: false, message: "products_per_ha debe ser un array u objeto" });
    }

    // Convertir products_per_ha a array y obtener tipos
    const productIds = Array.isArray(products_per_ha)
      ? products_per_ha.map((item) => item.product)
      : Object.values(products_per_ha).map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productUnits = products.reduce((acc, p) => {
      acc[p._id.toString()] = p.type || "litros"; // Fallback a "litros" si type no existe
      return acc;
    }, {});
    const productsPerHaArray = Array.isArray(products_per_ha)
      ? products_per_ha.map((item) => ({
          product: item.product,
          quantity: parseFloat(item.quantity) || 0,
          unit: productUnits[item.product] || "litros",
        }))
      : Object.values(products_per_ha).map((item) => ({
          product: item.product,
          quantity: parseFloat(item.quantity) || 0,
          unit: productUnits[item.product] || "litros",
        }));

    // Validar que productsPerHaArray no esté vacío y tenga ObjectId válidos
    if (productsPerHaArray.length === 0) {
      return res.status(400).json({ success: false, message: "Debe especificar al menos un producto" });
    }
    for (const item of productsPerHaArray) {
      if (!mongoose.isValidObjectId(item.product)) {
        return res.status(400).json({ success: false, message: `El producto ${item.product} no es un ObjectId válido` });
      }
      if (!item.unit) {
        return res.status(400).json({ success: false, message: `El producto ${item.product} no tiene tipo definido` });
      }
    }

    // Validar números
    const parsedMaxTank = parseFloat(maxTank);
    const parsedLtsXHa = parseFloat(lts_x_ha);
    const parsedHa = parseFloat(ha);
    const parsedTotalCost = parseFloat(totalCost);
    const parsedCostPerHa = parseFloat(costPerHa);

    if (
      isNaN(parsedMaxTank) ||
      isNaN(parsedLtsXHa) ||
      isNaN(parsedHa) ||
      isNaN(parsedTotalCost) ||
      isNaN(parsedCostPerHa) ||
      parsedMaxTank <= 0 ||
      parsedLtsXHa <= 0 ||
      parsedHa <= 0
    ) {
      return res.status(400).json({ success: false, message: "Valores numéricos inválidos" });
    }

    // Calcular tancadas
    const totalLiters = (parsedLtsXHa * parsedHa).toFixed(3);
    const tanks = Math.ceil(totalLiters / parsedMaxTank);
    const litersPerTank = (totalLiters / tanks).toFixed(3);

    // Generar products_per_tank y products_total
    const productsPerTank = productsPerHaArray.map((item) => ({
      product: item.product,
      quantity: ((item.quantity * litersPerTank) / parsedLtsXHa).toFixed(3),
      unit: item.unit,
    }));

    const productsTotal = productsPerHaArray.map((item) => ({
      product: item.product,
      quantity: (item.quantity * parsedHa).toFixed(3),
      unit: item.unit,
    }));

    const recipeData = {
      owner,
      field,
      recipe: [
        {
          tanks: parseFloat(tanks),
          lts_x_ha: parsedLtsXHa.toFixed(3),
          liters_per_tank: parseFloat(litersPerTank),
          field,
          date: new Date(date),
          products_per_ha: productsPerHaArray,
          products_per_tank: productsPerTank,
          products_total: productsTotal,
        },
      ],
      date: new Date(date),
      totalCost: parsedTotalCost.toFixed(3),
      costPerHa: parsedCostPerHa.toFixed(3),
    };

    const result = await recipeManager.createRecipe(recipeData);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ success: false, message: "Error al crear receta" });
    }
  } catch (error) {
    console.error("Error en POST /recipes/new-recipe:", error.message, error.stack);
    res.status(500).json({ success: false, message: `Error al crear receta: ${error.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE /recipes/:id - Sesión:", req.session.login, "Usuario:", req.session.user, "ID:", req.params.id); // Depuración
    if (!req.session.login || !req.session.user || !req.session.user._id) {
      return res.status(401).json({ success: false, message: "Sesión terminada, vuelva a iniciar sesión" });
    }
    const ownerId = req.session.user._id;
    const recipeId = req.params.id;

    if (!mongoose.isValidObjectId(recipeId)) {
      console.log("ID de receta inválido:", recipeId); // Depuración
      return res.status(400).json({ success: false, message: "ID de receta inválido" });
    }

    const result = await recipeManager.deleteRecipe(recipeId, ownerId);
    console.log("Resultado de deleteRecipe:", result); // Depuración
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error en DELETE /recipes/:id:", error.message, error.stack);
    res.status(400).json({ success: false, message: error.message });
  }
});