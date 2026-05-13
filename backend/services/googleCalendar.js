import { google } from "googleapis";
import dayjs from "dayjs";

const auth = new google.auth.GoogleAuth({
    keyFile: "./google-calendar.json",
    scopes: ["https://www.googleapis.com/auth/calendar"]
});

const calendar = google.calendar({
    version: "v3",
    auth
});

const calendarId = "fibromagiaplus@gmail.com";


// 🔎 HORARIOS DISPONIBLES
export const obtenerHorariosDisponibles = async (fecha) => {

    // VALIDACIÓN IMPORTANTE
    if (!fecha) {
        throw new Error("Fecha requerida");
    }

    const inicio = dayjs(`${fecha}T09:00:00`);
    const fin = dayjs(`${fecha}T18:00:00`);

    // VALIDAR FECHA
    if (!inicio.isValid() || !fin.isValid()) {
        throw new Error("Fecha inválida");
    }

    const eventos = await calendar.events.list({
        calendarId,
        timeMin: inicio.toISOString(),
        timeMax: fin.toISOString(),
        singleEvents: true,
        orderBy: "startTime"
    });

    const ocupados = eventos.data.items.map(evento => ({
        inicio: dayjs(evento.start.dateTime),
        fin: dayjs(evento.end.dateTime)
    }));

    const horarios = [];

    for (let h = 9; h < 18; h++) {

        const horaInicio =
            dayjs(`${fecha}T${String(h).padStart(2, "0")}:00:00`);

        const horaFin =
            horaInicio.add(1, "hour");

        const ocupado = ocupados.some(o =>

            horaInicio.isBefore(o.fin) &&
            horaFin.isAfter(o.inicio)
        );

        if (!ocupado) {
            horarios.push(
                horaInicio.format("HH:mm")
            );
        }
    }

    return horarios;
};


// 📅 CREAR EVENTO
export const crearEvento = async ({
    nombre,
    email,
    fecha,
    hora
}) => {

    const inicio =
        dayjs(`${fecha}T${hora}:00`);

    const fin =
        inicio.add(1, "hour");

    if (!inicio.isValid()) {
        throw new Error("Fecha u hora inválida");
    }

    const evento = {

        summary:
            `Reunión NeuralOps - ${nombre}`,

        description:
`
Cliente: ${nombre}
Email: ${email}
        `,

        start: {
            dateTime: inicio.toISOString(),
            timeZone: "America/Argentina/Buenos_Aires"
        },

        end: {
            dateTime: fin.toISOString(),
            timeZone: "America/Argentina/Buenos_Aires"
        }
    };

    const response = await calendar.events.insert({
        calendarId,
        resource: evento
    });

    return response.data;
};