import mongoose from "mongoose";

const reunionSchema = new mongoose.Schema({

    nombre: String,

    email: String,

    fecha: {
        type: String,
        required: true
    },

    hora: {
        type: String,
        required: true
    }

}, {

    timestamps: true

});

// Nunca permitir dos reuniones iguales
reunionSchema.index(
    {
        fecha: 1,
        hora: 1
    },
    {
        unique: true
    }
);

export default mongoose.model("Reunion", reunionSchema);