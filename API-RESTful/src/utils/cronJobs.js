import cron from "node-cron";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Client from "../models/client.js";
import { io } from "../config/messaging.js";
import { Expo } from "expo-server-sdk"

export const startCronJob = (server) => {

  const expo = new Expo();

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

      const mensajes = [];
      clients.forEach((client) => {
        const { name } = client.user_id;
        const notificationToken = client.notificationToken;

        if ( Expo.isExpoPushToken(notificationToken) ){
          mensajes.push({
            to: notificationToken,
            sound: "default",
            title: "¡Es hora de tu entrenamiento!",
            body: `¡Hola ${name}! Recuerda que hoy es uno de tus días de entrenamiento (${today}).`,
            data: { userId : client.user_id._id },
          })
        }

        // console.log(
        //   `Hoy es ${today}. Recordatorio enviado a: ${name}`
        // );

        // io.emit("reminder", {
        //   name,
        //   email,
        //   day: today,
        // });
      });

      const chunks = expo.chunkPushNotifications( mensajes );
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }

      console.log("Notificaciones enviadas con éxito");
      

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
