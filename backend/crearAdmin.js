import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";
import dotenv from "dotenv";

dotenv.config();

async function crearAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admins = [
            { user: "belu", pass: "1234" },
            { user: "gonza", pass: "5678" }
        ];

        for (let admin of admins) {
            const existe = await Admin.findOne({ user: admin.user });

            if (existe) {
                console.log(`⚠️ ${admin.user} ya existe`);
                continue;
            }

            const hash = await bcrypt.hash(admin.pass, 10);

            await Admin.create({
                user: admin.user,
                password: hash
            });

            console.log(`✅ Admin creado: ${admin.user}`);
        }

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

crearAdmins();