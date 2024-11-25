import cron from "node-cron";
import { Server } from "socket.io";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Client from "../models/client.js";

export const startCronJob = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  const checkTrainingReminders = async () => {
    try {
      const today = format(new Date(), "EEEE", { locale: es }).toLowerCase();

      console.log(
        `Iniciando la verificación de recordatorios para el día: ${today}`
      );

      const clients = await Client.find({ days: today }).populate(
        "user_id",
        "name email"
      );

      if (clients.length === 0) {
        console.log(`No se encontraron clientes que entrenen hoy (${today}).`);
        return;
      }

      clients.forEach((client) => {
        const { name, email } = client.user_id;
        console.log(
          `Hoy es ${today}. Recordatorio enviado a: ${name} (${email})`
        );

        io.emit("reminder", {
          name,
          email,
          day: today,
        });
      });
    } catch (error) {
      console.error("Error al verificar recordatorios:", error);
    }
  };

  cron.schedule("0 7 * * *", checkTrainingReminders, {
    timezone: "America/Guayaquil",
  });

  console.log(
    "Cron job programado para enviar recordatorios de entrenamiento diariamente a las 7:00 AM."
  );
};
