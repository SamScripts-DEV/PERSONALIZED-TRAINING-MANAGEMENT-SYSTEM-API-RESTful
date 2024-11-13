import cron from 'node-cron';
import { saveExercises } from '../controllers/exercises.controller';

cron.schedule('0 0 * * *', async () => {
    saveExercises();
})