import { fetchallexercises, fetchExcercisesByID } from "../services/exercisesAPI.js";
import Exercise from "../models/exercises.js";


const allExercises = async(req, res) => {
    try {
        const exercises = await fetchallexercises();
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
        
    }
};



const exercisesByID = async(req, res) => {
    try {
        const exercise = await fetchExcercisesByID();
        res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
    }
};


const getAllExercisesWithDetails = async(req, res) => {
    try {
        const exercisesIDs = await fetchallexercises();
        if(!exercisesIDs){
            res.status(404).json({res:"No se encontraron ejercicios"});
        }

        const exercisesWithDetails = await Promise.all(
            exercisesIDs.map(id => fetchExcercisesByID(id))
        )

        res.status(200).json(exercisesWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
        
    }
};

const getAllExercisesWithDetailsforSave = async() => {
    try {
        const exercisesIDs = await fetchallexercises();
        if(!exercisesIDs){
            console.log("No se encontraron ejercicios");
        }

        const exercisesWithDetails = await Promise.all(
            exercisesIDs.map(id => fetchExcercisesByID(id))
        )
       

        const validExercises = exercisesWithDetails.filter(exercise => exercise.id);
        await Promise.all(
            exercisesWithDetails.map(async (exercise) => {
                if (exercise.id && exercise.id.trim() !== '') {
                    await Exercise.findOneAndUpdate(
                        { apiID: exercise.id },
                        {...exercise, apiID: exercise.id},
                        { upsert: true, new: true }
                    );
                } else {
                    console.log("Ejercicio con id inválido:", exercise);
                }
            })
        )
    } catch (error) {
        console.error(error)
    }
};






const viewAllExercises = async(req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
    }
};

const viewAllExercisesByID = async(req, res) => {
    const {id} = req.params;
    try {
        const exercise = await Exercise.findById(id);
        res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
        
    }
};




export{
    allExercises,
    exercisesByID,
    getAllExercisesWithDetails,
    getAllExercisesWithDetailsforSave,

    viewAllExercises,
    viewAllExercisesByID

}

