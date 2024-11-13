import axios from "axios";

const fetchallexercises = async() => {

    const options = {
        method: 'GET',
        url: 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises',
        headers: {
            'x-rapidapi-key': process.env.API_KEY,
            'x-rapidapi-host': process.env.API_HOST
        }
    }

    try {
        const response = await axios.request(options);
        console.log(response.data);
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const fetchExcercisesByID = async(id) => {
    
        const options = {
            method: 'GET',
            url: `https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercise/${id}`,
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST
            }
        }
    
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(`Error al conseguir detalles del ejercicio`,error);
        }
};




const fetchTypesforExercises = async() => {
    
        const options = {
            method: 'GET',
            url: 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/list/equipment',
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST
            }
        }
    
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error(error);
        }
};


const fetchMusclesforExercises = async() => {
    const options = {
        method: 'GET',
        url: 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises/muscles',
        headers: {
            'x-rapidapi-key': process.env.API_KEY,
            'x-rapidapi-host': process.env.API_HOST
        }
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export{
    fetchallexercises,
    fetchTypesforExercises,
    fetchExcercisesByID
}