import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", leadRoutes);


console.log("ENV cargado:", !!process.env.EMAIL_USER);

// conexión Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado ✅"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", process.env.PORT);
});