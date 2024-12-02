import mongoose from 'mongoose';
import {syncExercisesOnStart} from './controllers/exercises.controller.js';


mongoose.set('strictQuery', true);

const connection = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI_PRODUCTION)
        console.log(`Database connected to: ${connection.host} - ${connection.port}`);
        
        await syncExercisesOnStart();
        
        

        
    } catch (error) {
        console.log(error);
        
    }
}

export default connection;