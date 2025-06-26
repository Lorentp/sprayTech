const express = require("express");
const router = express.Router();
const fieldManager = require("../managers/field.manager");

// Crear un lote
router.post("/new-field", async (req, res) => {
  try {
    const owner = req.session.user?._id;
    if (!owner) {
      throw new Error("Usuario no autenticado");
    }
    const { name, farmname, ha } = req.body;

    const newField = {
      name,
      farmname,
      ha: parseFloat(ha),
      owner,
    };

    const field = await fieldManager.createField(newField);
    res.status(201).json({ success: true, data: field });
  } catch (error) {
    console.error("Error al crear lote:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/update:cid", async (req, res) => {
  try {
    const newField = await fieldManager.updateField(req.params.cid, req.body);
    console.log(newField);
    res.redirect("/productos");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete/:cid", async (req, res) => {
  try {
    const fieldId = req.params.cid;
    const result = await fieldManager.deleteField(fieldId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error("Error al eliminar lote:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
