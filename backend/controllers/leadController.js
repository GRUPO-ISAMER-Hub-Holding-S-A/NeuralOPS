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

        // VALIDAR
        if (!nombre || !email || !mensaje) {

            return res.status(400).json({
                error: "Datos incompletos"
            });
        }

        // GUARDAR LEAD
        const nuevoLead = new Lead({
            nombre,
            email,
            mensaje,
            estado: "nuevo"
        });

        await nuevoLead.save();

        console.log("✅ Lead guardado");


        // =========================
        // MAIL (NO ROMPER SISTEMA)
        // =========================

        try {

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


            // MAIL CLIENTE
            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: "Recibimos tu solicitud 🚀",

                html: `
                    <h2>Hola ${nombre}</h2>

                    <p>
                        Recibimos tu consulta correctamente.
                    </p>

                    <p>
                        En breve nos contactaremos con vos.
                    </p>

                    <p>
                        Equipo NeuralOps 🚀
                    </p>
                `
            });

            console.log("✅ Mails enviados");

        } catch (mailError) {

            console.log("❌ ERROR MAIL:");
            console.log(mailError);
        }

        // RESPUESTA OK SIEMPRE
        res.json({
            message: "Lead guardado correctamente"
        });

    } catch (error) {

        console.log("❌ ERROR GENERAL:");
        console.log(error);

        res.status(500).json({
            error: "Error del servidor"
        });
    }
};