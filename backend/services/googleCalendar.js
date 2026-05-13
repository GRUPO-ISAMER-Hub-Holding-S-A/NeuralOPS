import { google } from "googleapis";
import dayjs from "dayjs";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ["https://www.googleapis.com/auth/calendar"]
});

const calendar = google.calendar({
    version: "v3",
    auth
});

const calendarId = process.env.GOOGLE_CALENDAR_ID;


// 🔎 HORARIOS DISPONIBLES
export const obtenerHorariosDisponibles = async (fecha) => {

    if (!fecha) {
        throw new Error("Fecha requerida");
    }

    const inicio = dayjs(fecha)
        .hour(9)
        .minute(0)
        .second(0);

    const fin = dayjs(fecha)
        .hour(18)
        .minute(0)
        .second(0);

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

        const horaInicio = dayjs(fecha)
            .hour(h)
            .minute(0)
            .second(0);

        const horaFin = horaInicio.add(1, "hour");

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

    const inicio = dayjs(`${fecha} ${hora}`);
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

    const response = await calendar.events.insert({
        calendarId,
        resource: evento
    });

    return response.data;
};