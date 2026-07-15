import { google } from "googleapis";
import dayjs from "dayjs";

const auth = new google.auth.GoogleAuth({
    credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,

        private_key: process.env.GOOGLE_PRIVATE_KEY
            .replace(/\\n/g, "\n"),

        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
    },

    scopes: [
        "https://www.googleapis.com/auth/calendar"
    ]
});

const calendar = google.calendar({
    version: "v3",
    auth
});

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;


// ==========================
// HORARIOS DISPONIBLES
// ==========================

export async function obtenerHorariosDisponibles(fecha) {

    try {

        if (!fecha) return [];

        const inicioDia = dayjs(fecha)
            .hour(9)
            .minute(0)
            .second(0);

        const finDia = dayjs(fecha)
            .hour(18)
            .minute(0)
            .second(0);

        const response = await calendar.events.list({

            calendarId: CALENDAR_ID,

            timeMin: inicioDia.toISOString(),

            timeMax: finDia.toISOString(),

            singleEvents: true,

            orderBy: "startTime"

        });

        console.log("CALENDAR:", CALENDAR_ID);

console.log(
    response.data.items.map(e => ({
        titulo: e.summary,
        inicio: e.start.dateTime
    }))
);

        const eventos = response.data.items || [];

        const ocupados = eventos.map(e =>
            dayjs(e.start.dateTime).format("HH:mm")
        );

        const horarios = [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00"
        ];

        const disponibles = horarios.filter(
            hora => !ocupados.includes(hora)
        );

        return disponibles;

    }

    catch (error) {

        console.log("❌ ERROR HORARIOS");

        console.log(error);

        return [];

    }

}



// ==========================
// CREAR EVENTO
// ==========================

export async function crearEventoGoogle({

    nombre,

    email,

    fecha,

    hora

}) {

    try {

        const inicio =
            dayjs(`${fecha} ${hora}`);

        const fin =
            inicio.add(1, "hour");

        const evento = {

            summary:
                `Reunión con ${nombre}`,

            description:
                `Cliente: ${email}`,

            start: {

                dateTime:
                    inicio.format("YYYY-MM-DDTHH:mm:ss"),

                timeZone:
                    "America/Argentina/Buenos_Aires"

            },

            end: {

                dateTime:
                    fin.format("YYYY-MM-DDTHH:mm:ss"),

                timeZone:
                    "America/Argentina/Buenos_Aires"

            }

        };

        const creado =
            await calendar.events.insert({

                calendarId: CALENDAR_ID,

                resource: evento

            });

        console.log("✅ Evento creado en Google Calendar");

        return creado.data;

    }

    catch (error) {

        console.log("❌ ERROR GOOGLE CALENDAR");

        console.log(error);

        throw error;

    }

}