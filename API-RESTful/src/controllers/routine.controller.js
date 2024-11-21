import Routine from "../models/routine.js";
import { Types } from "mongoose";
import Client from "../models/client.js";
import Coach from "../models/coach.js";

const createRoutine = async (req, res) => {
    try {
        const {client_id, days, comments, start_date, end_date} = req.body
        if(Object.values(req.body).includes('')) return res.status(400).json({res: 'Rellene todos los campos antes de enviar la solicitud'})

        if(!Array.isArray(days) || days.length === 0) return res.status(400).json({res: 'Los días deben ser un arreglo de objetos'})

        if(!Types.ObjectId.isValid(client_id)) return res.status(400).json({res: 'El id del cliente no es válido'})

        const clientExist = await Client.exists({_id: client_id}) 
        if(!clientExist) return res.status(400).json({res: 'El cliente no existe'})

        const userID = req.userBDD._id
        const coach = await Coach.findOne({user_id: userID})
        if(!coach) return res.status(400).json({res: 'El usuario no es un coach, no puede asignar rutinas a los clientes'})
        const coach_id = coach._id

        const startDate = new Date(start_date)
        const endDate = new Date(end_date)
        const durationDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24))
        if(durationDays < 0) return res.status(400).json({res: 'La fecha de finalización debe ser posterior a la fecha de inicio'})

        const newRoutine = new Routine({
            client_id,
            coach_id,
            days,
            comments,
            assignment_date: Date.now(),
            start_date: startDate,
            end_date: endDate,
            durationDays,
            completed: false
        });

        await newRoutine.save()

        const currenDate = new Date()
        if((currenDate - endDate) >= 0){
            newRoutine.completed = true
            await newRoutine.save()
        }
           

        res.status(201).json({res: 'Rutina creada correctamente', newRoutine})

    } catch (error) {
        console.error(error)
        return res.status(500).json({res: 'Error en el servidor', error})
        
    }

};

const viewAllRoutines = async (req, res) => {
    try {
        const routines = await Routine.find().populate('client_id', 'name').populate('coach_id', 'name').populate('days.exercises').lean()
        if(routines.length === 0) return res.status(404).json({res: 'No hay rutinas registradas'})

        if(routines.length === 0) return res.status(404).json({res: 'No hay rutinas encontradas'})

        const formattedRoutines = routines.map(routine => {
            return {
                ...routine,
                days: routine.days.map(day => ({
                    ...day,
                    exercises: day.exercises.map(exercise => ({
                        category: exercise.category,
                        equipment: exercise.equipment,
                        force: exercise.force,
                        images: exercise.images, // array con info dentro
                        instructions: exercise.instructions,
                        level: exercise.level,
                        mechanic: exercise.mechanic,
                        name: exercise.name,
                        primary: exercise.primary
                    }))
                }))
            };
        });

        res.status(200).json({res: 'Rutinas encontradas', routines: formattedRoutines})
        
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

        if(days.some(day.exercises.length === 0)) return res.status(400).json({res: 'Agregue al menos un ejercicio por día'})
        if(!Types.ObjectId.isValid(id)) return res.status(400).json({res: 'El id de la rutina no es válido'})
        

        const updatedRoutine = await Routine.findByIdAndUpdate(
            id, 
            {days, comments, start_date, end_date}, 
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
        const routine = await Routine.findById(id)
        if(!routine) return res.status(404).json({res: 'Rutina no encontrada'})

        const deletedRoutine = await Routine.findByIdAndDelete(id)
        

            

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