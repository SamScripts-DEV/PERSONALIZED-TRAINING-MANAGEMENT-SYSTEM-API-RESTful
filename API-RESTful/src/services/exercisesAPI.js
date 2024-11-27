import axios from "axios";


const fetchallexercises = async() => {

    const options = {
        method: 'GET',
        url: 'https://exercisedb.p.rapidapi.com/exercises',
        params: {
          limit: '100',
          offset: '0'
        },
        headers: {
          'x-rapidapi-key': process.env.API_KEY,
          'x-rapidapi-host': process.env.API_HOST
        }
      };
      
      try {
          const response = await axios.request(options);
          //console.log(response.data);
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
            console.error(`Error al conseguir detalles del ejercicio ${id}`,error);
        }
};













export{
    fetchallexercises,

    fetchExcercisesByID
}