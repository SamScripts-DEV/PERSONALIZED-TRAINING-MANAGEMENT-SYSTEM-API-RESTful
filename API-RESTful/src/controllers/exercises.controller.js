import { fetchallexercises, fetchTypesforExercises, fetchExcercisesByID } from "../services/exercisesAPI.js";

const allExercises = async(req, res) => {
    try {
        const exercises = await fetchallexercises();
        res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor"});
        
    }
};

const typesExercises = async(req, res) => {
    try {
        const types = await fetchTypesforExercises();
        res.status(200).json(types);
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
        const exercises = await fetchallexercises();
        if(!Array.isArray(exercises)){
            return res.status(500).json({res:"Error en el servidor"});
        }

        const detailsPromises = exercises.map(exercise => fetchExcercisesByID(exercise.id));

        const exerciseWithDetails = await Promise.all(detailsPromises);

        const validExercises = exerciseWithDetails.filter(Boolean);

        res.status(200).json(validExercises);

    } catch (error) {
        console.error(error);
        res.status(500).json({res:"Error en el servidor", error});
        
    }
}

export{
    allExercises,
    typesExercises,
    exercisesByID,
    getAllExercisesWithDetails
}

