import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { crearLead } from "../controllers/leadController.js";

import {
    horariosDisponibles,
    crearReunion
} from "../controllers/reunionController.js";

import Lead from "../models/Lead.js";
import Admin from "../models/Admin.js";

import { verificarToken } from "../middleware/auth.js";

const router = express.Router();


// 📩 CREAR LEAD
router.post("/lead", crearLead);


// 📊 OBTENER LEADS
router.get("/leads", verificarToken, async (req, res) => {

    try {

        const leads =
            await Lead.find()
            .sort({ createdAt: -1 });

        res.json(leads);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error al obtener leads"
        });
    }
});


// 🗑️ ELIMINAR LEAD
router.delete("/lead/:id", verificarToken, async (req, res) => {

    try {

        await Lead.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Lead eliminado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error eliminando"
        });
    }
});


// ✏️ ACTUALIZAR ESTADO
router.put("/lead/:id", verificarToken, async (req, res) => {

    try {

        const { estado } = req.body;

        const actualizado =
            await Lead.findByIdAndUpdate(

                req.params.id,

                { estado },

                { new: true }
            );

        res.json(actualizado);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error actualizando"
        });
    }
});


// 🔐 LOGIN
router.post("/login", async (req, res) => {

    try {

        const { user, pass } = req.body;

        const admin =
            await Admin.findOne({ user });

        if (!admin) {

            return res.status(401).json({
                error: "Usuario no existe"
            });
        }

        const valid =
            await bcrypt.compare(
                pass,
                admin.password
            );

        if (!valid) {

            return res.status(401).json({
                error: "Password incorrecto"
            });
        }

        const token = jwt.sign(

            { user: admin.user },

            process.env.JWT_SECRET || "secreto123",

            {
                expiresIn: "2h"
            }
        );

        res.json({ token });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error login"
        });
    }
});


// 📅 HORARIOS
router.get(
    "/horarios",
    horariosDisponibles
);


// 📅 REUNIÓN
router.post(
    "/reunion",
    crearReunion
);


export default router;