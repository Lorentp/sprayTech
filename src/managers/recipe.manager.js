const Recipe = require("../models/recipe.model"); 
const mongoose = require("mongoose")// Ajusta la ruta según tu estructura

class RecipeManager {
  // Crear una receta
  async createRecipe(recipeData) {
    try {
        if (!recipeData.owner || !recipeData.field || !recipeData.recipe) {
        throw new Error("Faltan campos requeridos: owner, field, o recipe");
      }

      const ownerId = new mongoose.Types.ObjectId(recipeData.owner);
      const fieldId = new mongoose.Types.ObjectId(recipeData.field);

      if (!Array.isArray(recipeData.recipe) || recipeData.recipe.length === 0) {
        throw new Error("El campo recipe debe ser un array no vacío");
      }

      if (
        recipeData.totalCost < 0 ||
        recipeData.costPerHa < 0 ||
        recipeData.recipe[0].tanks <= 0 ||
        recipeData.recipe[0].lts_x_ha < 0 ||
        recipeData.recipe[0].liters_per_tank < 0 ||
        recipeData.recipe[0].products_per_ha.some((p) => p.quantity < 0 || !p.unit || p.unit.trim() === "") ||
        recipeData.recipe[0].products_per_tank.some((p) => p.quantity < 0 || !p.unit || p.unit.trim() === "") ||
        recipeData.recipe[0].products_total.some((p) => p.quantity < 0 || !p.unit || p.unit.trim() === "")
      ) {
        throw new Error("Los valores numéricos deben ser mayores o iguales a cero y cada producto debe tener una unidad válida");
      }

      const recipe = await Recipe.create({
        owner: ownerId,
        field: fieldId,
        recipe: recipeData.recipe,
        date: recipeData.date ? new Date(recipeData.date) : undefined,
        totalCost: parseFloat(recipeData.totalCost).toFixed(3),
        costPerHa: parseFloat(recipeData.costPerHa).toFixed(3),
      });

      return { success: true, recipe };
    } catch (error) {
      console.error("Error en createRecipe:", error.message, error.stack);
      throw new Error(`Error al crear receta: ${error.message}`);
    }
  }

  // Modificar una receta
  async updateRecipe(recipeId, ownerId, updateData) {
    try {
      const recipe = await Recipe.findOneAndUpdate(
        { _id: recipeId, owner: ownerId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (!recipe) {
        throw new Error("Receta no encontrada o no pertenece al usuario");
      }
      return recipe;
    } catch (error) {
      throw new Error(`Error al modificar receta: ${error.message}`);
    }
  }

  // Eliminar una receta
  async deleteRecipe(recipeId, ownerId) {
    try {
      console.log("deleteRecipe llamado con recipeId:", recipeId, "ownerId:", ownerId); // Depuración
      const recipe = await Recipe.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(recipeId),
        owner: new mongoose.Types.ObjectId(ownerId),
      });
      if (!recipe) {
        console.log("Receta no encontrada para recipeId:", recipeId, "ownerId:", ownerId); // Depuración
        throw new Error("Receta no encontrada o no pertenece al usuario");
      }
      console.log("Receta eliminada:", recipe._id); // Depuración
      return { message: "Receta eliminada correctamente" };
    } catch (error) {
      console.error("Error en deleteRecipe:", error.message, error.stack);
      throw new Error(`Error al eliminar receta: ${error.message}`);
    }
  }

 //Get recipes 
 async getRecipes(ownerId) {
    try {
      const recipes = await Recipe.find({ owner: ownerId })
        .populate("field")
        .populate("recipe.products_per_ha.product")
        .populate("recipe.products_per_tank.product")
        .populate("recipe.products_total.product")
        .lean();
      console.log("Recetas obtenidas en getRecipes:", JSON.stringify(recipes, null, 2));
      return recipes;
    } catch (error) {
      console.error("Error en getRecipes:", error.message, error.stack);
      throw new Error(`Error al obtener recetas: ${error.message}`);
    }
  }
}

module.exports = new RecipeManager();
