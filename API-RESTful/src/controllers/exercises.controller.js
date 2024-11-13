import { fetchallexercises, fetchExcercisesByID } from "../services/exercisesAPI.js";

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
}


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
}

export{
    allExercises,
    exercisesByID,
    getAllExercisesWithDetails
}

