import Client from "../models/client.js";
import CompletedDays from "../models/completedDays.js";

const markDaysAsCompleted = async (req, res) => {
  try {
    const userID = req.userBDD._id;
    
    const { day } = req.body;

    const quitarAcentos = (cadena) => {
      return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const currentDay = quitarAcentos(new Date().toLocaleString('es-ES', { weekday: 'long'}));

    if( day !== currentDay ){
        return res.status(400).json({ res: "El día no coincide con el día actual"})
    }

    const client = await Client.findOne({ user_id: userID });

    if (!client) {
      return res.status(404).json({ res: "Cliente no encontrado" });
    }

    const completeDay = await CompletedDays.findOneAndUpdate(
      { client_id: client._id, day },
      { completed: true , date: new Date()  },
      { new: true, upsert: true }
    );

    res.status(200).json({ res: "Dia marcado como completado" , completeDay });

  } catch (error) {
    res.status(500).json({ res: "Error en el servidor" });
  }
};

const viewCompletedDays = async (req, res) => {
    try {
        const userID = req.userBDD._id;

        const client = await Client.findOne({ user_id: userID });

        if (!client) { return res.status(404).json({ res: "Cliente no encontrado" }); }

        const completedDays = await CompletedDays.find({ user_id: userID }).sort({ date: -1 });
        
        res.status(200).json({ res: "Días completados encontrados", completedDays });
    } catch (error) {
        res.status(500).json({ res: "Error en el servidor" });
    }
}

export { markDaysAsCompleted , viewCompletedDays };
