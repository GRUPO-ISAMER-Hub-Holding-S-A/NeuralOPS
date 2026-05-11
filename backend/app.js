import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import leadRoutes from "./routes/leadRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

app.use(express.json());

app.use("/api", leadRoutes);
app.use(limiter);


console.log("ENV cargado:", !!process.env.EMAIL_USER);

// conexión Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado ✅"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", process.env.PORT);
});