const express = require("express");
const router = express.Router();
const productManager = require("../managers/product.manager");
const fieldManager = require("../managers/field.manager");
const recipeManager = require("../managers/recipe.manager")

router.get("/registrar", async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const errors = req.session.errors || {};
    delete req.session.errors;
    res.render("login", { errors });
  } catch (error) {
    console.log(error);
  }
});

router.get("/home", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }

    userId = req.session.user._id;
    user = req.session.user;
    res.render("home", { user });
  } catch (error) {
    console.log(error);
  }
});

router.get("/productos", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }

    owner = req.session.user._id;
    user = req.session.user;
    const products = await productManager.getProducts(user);

    res.render("products", { user, products });
  } catch (error) {
    console.log(error);
  }
});
router.get("/recetas", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }

    owner = req.session.user._id;
    user = req.session.user;
    
    const fields = await fieldManager.getFields(user)
    const products = await productManager.getProducts(user)

    res.render("recipes", { user, fields, products});
  } catch (error) {
    console.log(error);
  }
});
router.get("/ver-recetas", async (req, res) => {
  try {
    if (!req.session.login || !req.session.user || !req.session.user._id) {
      return res.status(401).redirect("/");
    }
    const ownerId = req.session.user._id;
    const user = req.session.user;
    const recipes = await recipeManager.getRecipes(ownerId);
    res.render("recipes-list", { user, recipes });
  } catch (error) {
    console.error("Error en GET /recipes-list:", error.message, error.stack);
    res.status(500).send("Error al cargar las recetas");
  }
});
router.get("/lotes", async (req, res) => {
  try {
    if (!req.session.login) {
      res.redirect("/");
      return;
    }

    userId = req.session.user._id;
    user = req.session.user;

    const fields = await fieldManager.getFields(user);
    res.render("fields-list", { user, fields });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
