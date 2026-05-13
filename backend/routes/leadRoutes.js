import express from "express";

import {
    crearLead,
    obtenerLeads,
    eliminarLead,
    actualizarEstado
} from "../controllers/leadController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// 📩 FORMULARIO
router.post("/lead", crearLead);


// 📥 ADMIN LEADS
router.get(
    "/leads",
    authMiddleware,
    obtenerLeads
);


// 🗑️ ELIMINAR
router.delete(
    "/lead/:id",
    authMiddleware,
    eliminarLead
);


// ✏️ ACTUALIZAR
router.put(
    "/lead/:id",
    authMiddleware,
    actualizarEstado
);

export default router;