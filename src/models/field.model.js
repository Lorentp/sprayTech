const mongoose = require("mongoose")

const fieldSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: {type:String},
    ha: {type:Number},
    farmname: {type:String}
})

const FieldModel = mongoose.model("Field", fieldSchema)


module.exports = FieldModel