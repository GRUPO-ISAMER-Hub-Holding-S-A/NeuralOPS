import dotenv from "dotenv";
dotenv.config();

import transporter from "./config/mailer.js";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "CARGADA" : "VACÍA");

async function test() {

    try {

        console.log("Probando conexión...");

        await transporter.verify();

        console.log("SMTP conectado");

        const info = await transporter.sendMail({

            from: `"NeuralOps" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: "TEST SMTP",

            html: "<h2>Funcionó correctamente</h2>"

        });

        console.log(info);

    }

    catch(err){

        console.log(err);

    }

}

test();