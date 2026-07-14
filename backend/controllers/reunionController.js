import {
    obtenerHorariosDisponibles,
    crearEventoGoogle
} from "../services/googleCalendar.js";
import Reunion from "../models/Reunion.js";


// 📅 OBTENER HORARIOS
export const horariosDisponibles = async (req, res) => {

    try {

        const { fecha } = req.query;

        const horarios =
            await obtenerHorariosDisponibles(fecha);

        res.json(horarios);

    } catch (error) {

        console.log("❌ ERROR HORARIOS:", error);

        res.status(500).json({
            error: "Error obteniendo horarios"
        });
    }
};




// 📅 CREAR REUNION
export const crearReunion = async (req, res) => {
    console.log("==================================");
console.log("VERSION 06/04 - CREAR REUNION");
console.log(req.body);
console.log("==================================");

    try {

        const {
            nombre,
            email,
            fecha,
            hora
        } = req.body;

        // Verificar si ya existe en Mongo
        const existe = await Reunion.findOne({
            fecha,
            hora
        });

        if (existe) {

            return res.status(409).json({
                error: "Ese horario ya fue reservado."
            });

        }

        // Crear evento Google
        await crearEventoGoogle({
            nombre,
            email,
            fecha,
            hora
        });

        // Guardar reunión
        await Reunion.create({
            nombre,
            email,
            fecha,
            hora
        });

        res.json({
            message: "Reunión agendada correctamente"
        });

    }
    catch (error) {

        console.log(error);

        if (
            error.code === 11000 ||
            error.message === "HORARIO_OCUPADO"
        ) {

            return res.status(409).json({
                error: "Ese horario ya fue reservado."
            });

        }

        res.status(500).json({
            error: "Error creando reunión"
        });

    }

};
