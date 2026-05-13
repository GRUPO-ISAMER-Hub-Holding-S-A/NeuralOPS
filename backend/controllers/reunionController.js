import {
    obtenerHorariosDisponibles,
    crearEvento
} from "../services/googleCalendar.js";


// 🔎 HORARIOS DISPONIBLES
export const horariosDisponibles = async (req, res) => {

    try {

        const { fecha } = req.query;

        const horarios =
            await obtenerHorariosDisponibles(fecha);

        res.json(horarios);

    } catch (error) {

        console.log("ERROR GOOGLE:");
        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
};


// 📅 CREAR REUNIÓN
export const crearReunion = async (req, res) => {

    try {

        const {
            nombre,
            email,
            fecha,
            hora
        } = req.body;

        const horarios =
            await obtenerHorariosDisponibles(fecha);

        if (!horarios.includes(hora)) {

            return res.status(400).json({
                error: "Horario no disponible"
            });
        }

        const evento = await crearEvento({
            nombre,
            email,
            fecha,
            hora
        });

        res.json({
            message: "Reunión agendada",
            evento
        });

    } catch (error) {

        console.log("ERROR CREANDO REUNIÓN:");
        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }
};