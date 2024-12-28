import Client from '../models/client.js';
import CompletedDays from '../models/completedDays.js';

export const markDaysAsCompleted = async (req, res) => {
    try {
        const {
            userBDD: { _id: user_id },
            body: { day },
        } = req;

        const quitarAcentos = (cadena) =>
            cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const currentDay = quitarAcentos(
            new Date().toLocaleString('es-ES', { weekday: 'long' }),
        );

        if (day !== currentDay)
            return res
                .status(400)
                .json({ res: 'El día no coincide con el día actual' });

        const client_id = await Client.exists({ user_id });

        if (!client_id)
            return res.status(404).json({ res: 'Cliente no encontrado' });

        const completeDay = await CompletedDays.findOneAndUpdate(
            { client_id, day },
            { completed: true, date: new Date() },
            { new: true, upsert: true },
        );

        res.status(200).json({
            res: 'Dia marcado como completado',
            completeDay,
        });
    } catch (error) {
        res.status(500).json({ res: 'Error en el servidor' });
    }
};

export const viewCompletedDays = async (req, res) => {
    try {
        const { _id: user_id } = req.userBDD;

        if (!(await Client.exists({ user_id })))
            return res.status(404).json({ res: 'Cliente no encontrado' });

        const completedDays = await CompletedDays.find({
            user_id,
        });

        res.status(200).json({
            res: 'Días completados encontrados',
            completedDays,
        });
    } catch (error) {
        res.status(500).json({ res: 'Error en el servidor' });
    }
};
