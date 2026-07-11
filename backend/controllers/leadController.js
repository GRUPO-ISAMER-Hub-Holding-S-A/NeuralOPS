import Lead from "../models/Lead.js";
import transporter from "../config/mailer.js";


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
        // ENVIAR MAILS
        // =========================

        try {

            console.log("EMAIL_USER:", process.env.EMAIL_USER);

            await transporter.verify();

            console.log("✅ SMTP conectado");


            // ---------------------
            // MAIL EMPRESA
            // ---------------------

            const empresaMail = await transporter.sendMail({

                from: `"NeuralOps" <${process.env.EMAIL_USER}>`,

                to: process.env.EMAIL_USER,

                subject: "Nuevo Lead NeuralOps 🚀",

                html: `
                    <h2>Nuevo Lead</h2>

                    <p><strong>Nombre:</strong> ${nombre}</p>

                    <p><strong>Email:</strong> ${email}</p>

                    <p><strong>Mensaje:</strong></p>

                    <p>${mensaje}</p>
                `
            });

            console.log("✅ Mail empresa enviado");
            console.log(empresaMail.messageId);


            // ---------------------
            // MAIL CLIENTE
            // ---------------------

            const clienteMail = await transporter.sendMail({

                from: `"NeuralOps" <${process.env.EMAIL_USER}>`,

                to: email,

                subject: "Recibimos tu consulta 🚀",

                html: `
                    <h2>Hola ${nombre}</h2>

                    <p>
                        Gracias por comunicarte con NeuralOps.
                    </p>

                    <p>
                        Recibimos correctamente tu consulta y un asesor se pondrá
                        en contacto con vos a la brevedad.
                    </p>

                    <hr>

                    <b>Resumen de tu consulta:</b>

                    <p>${mensaje}</p>

                    <br>

                    Equipo NeuralOps 🚀
                `
            });

            console.log("✅ Mail cliente enviado");
            console.log(clienteMail.messageId);

        }

        catch (mailError) {

            console.log("❌ ERROR MAIL COMPLETO:");
            console.log(mailError);
        }


        // =========================
        // RESPUESTA
        // =========================

        res.json({

            ok: true,

            message: "Lead guardado correctamente"

        });

    }

    catch (error) {

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

    }

    catch (error) {

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

    }

    catch (error) {

        console.log("❌ ERROR ACTUALIZAR:");
        console.log(error);

        res.status(500).json({
            error: "Error al actualizar"
        });

    }

};