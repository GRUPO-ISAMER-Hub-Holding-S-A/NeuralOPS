import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import leadRoutes from "./routes/leadRoutes.js";

const app = express();


// 🔥 IMPORTANTE RENDER
app.set("trust proxy", 1);


// MIDDLEWARES
app.use(cors());

app.use(helmet());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.use(express.json());


// ROUTES
app.use("/api", leadRoutes);


// TEST API
app.get("/", (req, res) => {
    res.send("NeuralOps API funcionando 🚀");
});


// DEBUG ENV
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("MONGO:", !!process.env.MONGO_URI);
console.log("JWT:", !!process.env.JWT_SECRET);


// MONGO
mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        console.log("Mongo conectado ✅");
    })

    .catch((err) => {
        console.log("❌ ERROR MONGO");
        console.log(err);
    });


// PORT
const PORT = process.env.PORT || 4000;


// START SERVER
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});