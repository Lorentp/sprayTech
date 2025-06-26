const Field = require("../models/field.model"); // Ajusta la ruta según tu estructura
const { Types } = require("mongoose");

class FieldManager {
  // Crear un campo
  async createField(fieldData) {
    try {
      const field = await Field.create({
        owner: new Types.ObjectId(fieldData.owner),
        name: fieldData.name,
        farmname: fieldData.farmname,
        ha: parseFloat(fieldData.ha),
      });
      return field;
    } catch (error) {
      throw new Error(`Error al crear campo: ${error.message}`);
    }
  }

  // Modificar un campo
  async updateField(fieldId, ownerId, updateData) {
    try {
      const field = await Field.findOneAndUpdate(
        { _id: fieldId, owner: ownerId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (!field) {
        throw new Error("Campo no encontrado o no pertenece al usuario");
      }
      return field;
    } catch (error) {
      throw new Error(`Error al modificar campo: ${error.message}`);
    }
  }

  // Eliminar un campo
  async deleteField(fieldId, ownerId) {
    try {
      const field = await Field.findOneAndDelete({
        _id: fieldId,
      });
      if (!field) {
        throw new Error("Campo no encontrado o no pertenece al usuario");
      }
      return { message: "Campo eliminado correctamente" };
    } catch (error) {
      throw new Error(`Error al eliminar campo: ${error.message}`);
    }
  }

  //Get Fields
  async getFields(owner) {
    try {
      const ownerId = owner._id || owner;
      const fields = await Field.find({ owner: ownerId }).lean();
      return fields;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new FieldManager();
