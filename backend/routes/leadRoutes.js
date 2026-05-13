import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { crearLead } from "../controllers/leadController.js";
import { eliminarLead, actualizarEstado } from "../controllers/leadController.js";
import { horariosDisponibles, crearReunion } from "../controllers/reunionController.js";

import Lead from "../models/Lead.js";
import Admin from "../models/Admin.js";

import { verificarToken } from "../middleware/auth.js";

const router = express.Router();


// 📩 CREAR LEAD (PUBLICO)
router.post("/lead", crearLead);


// 📊 OBTENER LEADS (PROTEGIDO)
router.get("/leads", verificarToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener leads" });
    }
});


// 🗑️ ELIMINAR LEAD (PROTEGIDO)
router.delete("/lead/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const eliminado = await Lead.findByIdAndDelete(id);

        if (!eliminado) {
            return res.status(404).json({ error: "Lead no encontrado" });
        }

        res.json({ message: "Lead eliminado correctamente" });

    } catch (error) {
        console.log("❌ Error eliminar:", error);
        res.status(500).json({ error: "Error al eliminar lead" });
    }
});


// ✏️ ACTUALIZAR ESTADO (PROTEGIDO)
router.put("/lead/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const actualizado = await Lead.findByIdAndUpdate(
            id,
            { estado },
            { returnDocument: "after" }
        );

        if (!actualizado) {
            return res.status(404).json({ error: "Lead no encontrado" });
        }

        res.json(actualizado);

    } catch (error) {
        console.log("❌ Error actualizar:", error);
        res.status(500).json({ error: "Error al actualizar estado" });
    }
});


// 🔐 LOGIN ADMIN (MONGO REAL)
router.post("/login", async (req, res) => {
    try {
        const { user, pass } = req.body;

        const admin = await Admin.findOne({ user });

        if (!admin) {
            return res.status(401).json({ error: "Usuario no existe" });
        }

        const valid = await bcrypt.compare(pass, admin.password);

        if (!valid) {
            return res.status(401).json({ error: "Password incorrecto" });
        }

        const token = jwt.sign(
            { user: admin.user },
            process.env.JWT_SECRET || "secreto123",
            { expiresIn: "2h" }
        );

        res.json({ token });

    } catch (error) {
        console.log("❌ Error login:", error);
        res.status(500).json({ error: "Error en login" });
    }
});


// 👤 ACTUALIZAR ADMIN (PROTEGIDO)
router.put("/admin/update", verificarToken, async (req, res) => {
    try {
        const { nuevoUser, nuevoPass } = req.body;

        const admin = await Admin.findOne({ user: req.user });

        if (!admin) {
            return res.status(404).json({ error: "Admin no encontrado" });
        }

        if (nuevoUser) {
            admin.user = nuevoUser;
        }

        if (nuevoPass) {
            const hash = await bcrypt.hash(nuevoPass, 10);
            admin.password = hash;
        }

        await admin.save();

        res.json({ message: "Admin actualizado correctamente" });

    } catch (error) {
        console.log("❌ Error update admin:", error);
        res.status(500).json({ error: "Error actualizando admin" });
    }
});



// 📅 REUNIONES
router.get(
    "/horarios",
    horariosDisponibles
);

router.post(
    "/reunion",
    crearReunion
);



export default router;