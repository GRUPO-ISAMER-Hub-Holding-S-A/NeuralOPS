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

        // =========================
        // GUARDAR LEAD
        // =========================

        const nuevoLead = new Lead({
            nombre,
            email,
            mensaje,
            estado: "nuevo"
        });

        await nuevoLead.save();

        console.log("✅ Lead guardado");



        // =========================
        // ENVIAR MAIL
        // =========================

        try {

            console.log("EMAIL_USER:", process.env.EMAIL_USER);

            const transporter = nodemailer.createTransport({

                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },

                tls: {
                    rejectUnauthorized: false
                }
            });

            await transporter.verify();

            console.log("✅ SMTP conectado");


            // MAIL EMPRESA
            await transporter.sendMail({

                from: `"NeuralOps" <${process.env.EMAIL_USER}>`,

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

                from: `"NeuralOps" <${process.env.EMAIL_USER}>`,

                to: email,

                subject: "Recibimos tu consulta 🚀",

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

            console.log("✅ MAILS ENVIADOS");

        } catch (mailError) {

            console.log("❌ ERROR MAIL COMPLETO:");
            console.log(mailError);
        }


        // =========================
        // RESPUESTA OK
        // =========================

        res.json({
            ok: true,
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


// ===============================
// 🗑️ ELIMINAR LEAD
// ===============================
export const eliminarLead = async (req, res) => {

    try {

        const eliminado =
            await Lead.findByIdAndDelete(req.params.id);

        if (!eliminado) {

            return res.status(404).json({
                error: "Lead no encontrado"
            });
        }

        res.json({
            message: "Lead eliminado correctamente"
        });

    } catch (error) {

        console.log("❌ ERROR ELIMINAR:");
        console.log(error);

        res.status(500).json({
            error: "Error al eliminar lead"
        });
    }
};


// ===============================
// ✏️ ACTUALIZAR ESTADO
// ===============================
export const actualizarEstado = async (req, res) => {

    try {

        const { estado } = req.body;

        const actualizado =
            await Lead.findByIdAndUpdate(

                req.params.id,

                { estado },

                { new: true }
            );

        if (!actualizado) {

            return res.status(404).json({
                error: "Lead no encontrado"
            });
        }

        res.json(actualizado);

    } catch (error) {

        console.log("❌ ERROR ACTUALIZAR:");
        console.log(error);

        res.status(500).json({
            error: "Error al actualizar"
        });
    }
};