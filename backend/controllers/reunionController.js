import dayjs from "dayjs";
import { crearEventoGoogle, obtenerHorariosDisponibles } from "../services/googleCalendar.js";
import Reunion from "../models/Reunion.js";
import { feriados } from "../config/feriados.js";

// 📅 OBTENER HORARIOS
export const horariosDisponibles = async (req, res) => {

    try {

        const { fecha } = req.query;

        if (!fecha) {
            return res.json([]);
        }

        const dia = dayjs(fecha);

        // Pasado
        if (dia.isBefore(dayjs(), "day")) {
            return res.json([]);
        }

        // Domingo
        if (dia.day() === 0) {
            return res.json([]);
        }

        // Sábado
        if (dia.day() === 6) {
            return res.json([]);
        }

        // Feriados
        if (feriados.includes(fecha)) {
            return res.json([]);
        }

        // Reuniones guardadas en Mongo
        const reuniones = await Reunion.find({ fecha });

        const ocupadosMongo = reuniones.map(r => r.hora);

        // Horarios libres según Google Calendar
        const libresGoogle =
            await obtenerHorariosDisponibles(fecha);

        const horariosTrabajo = [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00"
        ];

        const disponibles = horariosTrabajo.filter(hora => {

            const ocupadoMongo =
                ocupadosMongo.includes(hora);

            const ocupadoGoogle =
                !libresGoogle.includes(hora);

            return !ocupadoMongo && !ocupadoGoogle;

        });

        res.json(disponibles);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error obteniendo horarios"
        });

    }

};



// 📅 CREAR REUNION
export const crearReunion = async (req, res) => {

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
