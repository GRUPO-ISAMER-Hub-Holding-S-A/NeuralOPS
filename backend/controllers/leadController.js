import Lead from "../models/Lead.js";
import nodemailer from "nodemailer";


// 📩 CREAR LEAD
export const crearLead = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const nuevoLead = new Lead({ nombre, email, mensaje });
    await nuevoLead.save();

    // 🔥 CREAR TRANSPORTER ACÁ 
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 📧 Mail interno
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nuevo lead NeuralOps 🚀",
      html: `
        <h2>Nuevo Lead</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
      `
    });

    // 📧 Mail cliente
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recibimos tu solicitud 🚀",
      html: `
        <h2>Hola ${nombre}</h2>
        <p>Recibimos tu solicitud correctamente.</p>
        <p>En breve nos contactamos con vos.</p>
        <p>El equipo de NeuralOps</p>
      `
    });

    res.json({ message: "Lead guardado y email enviado" });

  } catch (error) {

    console.log("ERROR BACK:");
    console.log(error);

    res.status(500).json({
        error: error.message
    });
}
};


// 🗑️ ELIMINAR LEAD
export const eliminarLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead eliminado" });
  } catch (error) {

    console.log("ERROR BACK:");
    console.log(error);

    res.status(500).json({
        error: error.message
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
      { returnDocument: "after" }
    );

    res.json(lead);
  } catch (error) {

    console.log("ERROR BACK:");
    console.log(error);

    res.status(500).json({
        error: error.message
    });
}
};