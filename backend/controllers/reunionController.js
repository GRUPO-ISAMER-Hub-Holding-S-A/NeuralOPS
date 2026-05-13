import {
    obtenerHorariosDisponibles,
    crearEvento
} from "../services/googleCalendar.js";


// 🔎 HORARIOS DISPONIBLES
export const horariosDisponibles = async (req, res) => {

    try {

        const { fecha } = req.query;

        // ✅ VALIDACIÓN
        if (!fecha) {
            return res.status(400).json({
                error: "Fecha requerida"
            });
        }

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


// 📅 CREAR REUNIÓN
export const crearReunion = async (req, res) => {

    try {

        const {
            nombre,
            email,
            fecha,
            hora
        } = req.body;

        // ✅ VALIDACIONES
        if (!nombre || !email || !fecha || !hora) {

            return res.status(400).json({
                error: "Faltan datos"
            });
        }

        const horarios =
            await obtenerHorariosDisponibles(fecha);

        // ✅ VALIDAR DISPONIBILIDAD
        if (!horarios.includes(hora)) {

            return res.status(400).json({
                error: "Horario no disponible"
            });
        }

        // ✅ CREAR EVENTO
        const evento = await crearEvento({
            nombre,
            email,
            fecha,
            hora
        });

        res.json({
            message: "Reunión agendada correctamente",
            evento
        });

    } catch (error) {

        console.log("❌ ERROR REUNIÓN:", error);

        res.status(500).json({
            error: "Error creando reunión"
        });
    }
};