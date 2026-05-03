import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  estado: {
    type: String,
    enum: ["nuevo", "contactado", "cliente"],
    default: "nuevo"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Lead", leadSchema);