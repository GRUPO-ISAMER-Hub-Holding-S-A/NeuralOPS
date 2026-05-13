import Lead from "../models/Lead.js";
import nodemailer from "nodemailer";


// 📩 CREAR LEAD
export const crearLead = async (req, res) => {

    try {

        const {
            nombre,
            email,
            mensaje
        } = req.body;

        if (!nombre || !email || !mensaje) {

            return res.status(400).json({
                error: "Datos incompletos"
            });
        }

        const nuevoLead = new Lead({
            nombre,
            email,
            mensaje
        });

        await nuevoLead.save();

        console.log("✅ Lead guardado");


        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });


        // MAIL INTERNO
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            subject: "Nuevo lead NeuralOps 🚀",

            html: `
                <h2>Nuevo Lead</h2>

                <p><strong>Nombre:</strong> ${nombre}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        });


        // MAIL CLIENTE
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
                    En breve nos contactaremos con vos.
                </p>
            `
        });

        res.json({
            message: "Lead guardado"
        });

    } catch (error) {

        console.log("❌ ERROR MAIL:");
        console.log(error);

        res.status(500).json({
            error: "Error al enviar"
        });
    }
};