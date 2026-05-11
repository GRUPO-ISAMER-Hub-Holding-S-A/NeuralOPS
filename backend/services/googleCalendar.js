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

// ✅ TU CALENDARIO REAL
const calendarId = "fibromagiaplus@gmail.com";


// 🔎 OBTENER HORARIOS LIBRES
export const obtenerHorariosDisponibles = async (fecha) => {

    const inicio = dayjs(fecha).hour(9).minute(0).toISOString();

    const fin = dayjs(fecha).hour(18).minute(0).toISOString();

    const eventos = await calendar.events.list({
        calendarId,
        timeMin: inicio,
        timeMax: fin,
        singleEvents: true,
        orderBy: "startTime"
    });

    const ocupados = eventos.data.items.map(evento => ({
        inicio: dayjs(evento.start.dateTime),
        fin: dayjs(evento.end.dateTime)
    }));

    const horarios = [];

    for (let h = 9; h < 18; h++) {

        const horaInicio = dayjs(fecha).hour(h).minute(0);

        const horaFin = horaInicio.add(1, "hour");

        const ocupado = ocupados.some(o =>
            horaInicio.isBefore(o.fin) &&
            horaFin.isAfter(o.inicio)
        );

        if (!ocupado) {
            horarios.push(horaInicio.format("HH:mm"));
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

    // ✅ FORMATO CORRECTO
    const inicio = dayjs(`${fecha}T${hora}`);

    // ✅ VALIDACIÓN
    if (!inicio.isValid()) {
        throw new Error("Fecha inválida");
    }

    const fin = inicio.add(1, "hour");

    const evento = {

        summary: `Reunión NeuralOps - ${nombre}`,

        description: `
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

    // ✅ CREAR EVENTO REAL
    const response = await calendar.events.insert({

        // 🔥 USAR TU CALENDARIO REAL
        calendarId,

        resource: evento
    });

    console.log("✅ EVENTO CREADO:");
    console.log(response.data.htmlLink);

    return response.data;
};