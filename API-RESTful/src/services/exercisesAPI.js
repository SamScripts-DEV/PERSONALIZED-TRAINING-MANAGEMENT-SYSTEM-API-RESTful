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
        const exercisesIDs = response.data.excercises_ids.slice(0, 100)
        
        
        return exercisesIDs;
        
        
       
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
            console.error(`Error al conseguir detalles del ejercicio ${id}`,error);
        }
};










export{
    fetchallexercises,

    fetchExcercisesByID
}