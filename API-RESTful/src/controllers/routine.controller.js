import Routine from "../models/routine.js";

const createRoutine = async (req, res) => {
    try {
        const {client_id, coach_id, days, comments} = req.body
        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})

        if(!Types.ObjectId.isValid(client_id) || !Types.ObjectId.isValid(coach_id)) return res.status(400).json({res: 'El id del cliente o del coach no es válido'})

        const clientExist = await client.exist({_id: client_id})
        const coachExist = await coach.exist({_id: coach_id})
        if(!clientExist || !coachExist) return res.status(400).json({res: 'El cliente o el coach no existen'})

        const newRoutine = new Routine({
            client_id,
            coach_id,
            days,
            comments,
            assignment_date: Date.now()
        });

        res.status(201).json({res: 'Rutina creada correctamente', newRoutine})

    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }

};

const viewAllRoutines = async (req, res) => {
    try {
        const routines = await Routine.find().populate('client_id', 'name').populate('coach_id', 'name').populate('days.exercises', 'apiID category')
        if(routines.length === 0) return res.status(404).json({res: 'No hay rutinas registradas'})

        if(routines.length === 0) return res.status(404).json({res: 'No hay rutinas encontradas'})

        res.status(200).json({res: 'Rutinas encontradas', routines})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const viewRoutineById = async (req, res) => {
    try {
        const {id} = req.params
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id de la rutina no es válido'})
        const routine = await Routine.findById(id).populate('client_id', 'name').populate('coach_id', 'name').populate('days.exercises', 'apiID category')
        if(!routine) return res.status(404).json({res: 'Rutina no encontrada'})

        res.status(200).json({res: 'Rutina encontrada', routine})
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const updateRoutine = async (req, res) => {
    try {
        const {id} = req.params
        const {days, comments} = req.body
        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id de la rutina no es válido'})
        

        const updatedRoutine = await Routine.findByIdAndUpdate(
            id, 
            {days, comments}, 
            {new: true, runValidators: true}
        ).populate('days.exercises', 'apiID category name instructions')

        if(!updatedRoutine) return res.status(404).json({res: 'Rutina no encontrada'})

        res.status(200).json({res: 'Rutina actualizada', updatedRoutine})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

const deleteRoutine = async (req, res) => {
    try {
        const {id} = req.params
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id de la rutina no es válido'})
        const deletedRoutine = await Routine.findByIdAndDelete(id)
        if(!deletedRoutine) return res.status(404).json({res: 'Rutina no encontrada'})

        res.status(200).json({res: 'Rutina eliminada', deletedRoutine})
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }
};

export{
    createRoutine,
    viewAllRoutines,
    viewRoutineById,
    updateRoutine,
    deleteRoutine
}