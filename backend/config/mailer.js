import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? "OK" : "VACÍA");

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    logger: true,
    debug: true,

    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,

    tls: {
        rejectUnauthorized: false,
        family: 4
    }

});

export default transporter;