import { fetchallexercises, fetchTypesforExercises } from "../services/exercisesAPI.js";

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
}

export{
    allExercises,
    typesExercises
}

