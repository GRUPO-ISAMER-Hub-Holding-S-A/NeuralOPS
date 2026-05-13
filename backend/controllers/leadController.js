import Lead from "../models/Lead.js";
import nodemailer from "nodemailer";


// 📩 CREAR LEAD
export const crearLead = async (req, res) => {

    try {

        const { nombre, email, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {

            return res.status(400).json({
                error: "Datos incompletos"
            });
        }

        // GUARDAR EN MONGO
        const nuevoLead = new Lead({
            nombre,
            email,
            mensaje
        });

        await nuevoLead.save();

        // MAILER
        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 📧 MAIL INTERNO
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "Nuevo lead NeuralOps 🚀",

            html: `
                <h2>Nuevo Lead</h2>

                <p>
                    <strong>Nombre:</strong>
                    ${nombre}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${email}
                </p>

                <p>
                    <strong>Mensaje:</strong>
                    ${mensaje}
                </p>
            `
        });

        // 📧 MAIL CLIENTE
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Recibimos tu solicitud 🚀",

            html: `
                <h2>Hola ${nombre}</h2>

                <p>
                    Recibimos tu solicitud correctamente.
                </p>

                <p>
                    En breve nos contactamos con vos.
                </p>

                <br>

                <p>
                    Equipo NeuralOps
                </p>
            `
        });

        res.json({
            message: "Lead guardado y email enviado"
        });

    } catch (error) {

        console.log("❌ ERROR MAIL:", error);

        res.status(500).json({
            error: "Error al enviar"
        });
    }
};



// 📥 OBTENER LEADS
export const obtenerLeads = async (req, res) => {

    try {

        const leads = await Lead.find()
            .sort({ createdAt: -1 });

        res.json(leads);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo leads"
        });
    }
};



// 🗑️ ELIMINAR LEAD
export const eliminarLead = async (req, res) => {

    try {

        await Lead.findByIdAndDelete(req.params.id);

        res.json({
            message: "Lead eliminado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error eliminando"
        });
    }
};



// ✏️ ACTUALIZAR ESTADO
export const actualizarEstado = async (req, res) => {

    try {

        const { estado } = req.body;

        const lead = await Lead.findByIdAndUpdate(

            req.params.id,

            { estado },

            { new: true }
        );

        res.json(lead);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error actualizando"
        });
    }
};