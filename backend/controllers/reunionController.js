import {
    obtenerHorariosDisponibles,
    crearEventoGoogle
} from "../services/googleCalendar.js";


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

    try {

        const {
            nombre,
            email,
            fecha,
            hora
        } = req.body;

        await crearEventoGoogle({
            nombre,
            email,
            fecha,
            hora
        });

        res.json({
            message: "Reunión agendada correctamente"
        });

    } catch (error) {

        console.log("❌ ERROR REUNION:", error);

        res.status(500).json({
            error: "Error creando reunión"
        });
    }
};