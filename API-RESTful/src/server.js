import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import routerUsers from './routers/users.routes.js';
import routerCoach from './routers/coach.routes.js';
import routerClient from './routers/client.routes.js';
import routerExercises from './routers/exercises.routes.js';
import routerRoutine from './routers/routine.routes.js';
import routerProgress from './routers/progress.routes.js';
import {createServer} from 'http';
import { getAllExercisesWithDetailsforSave} from './controllers/exercises.controller.js';

//Inicializamos
const app = express();


//Configuramos el puerto

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json()); 


//Rutas
app.get('/', (_, res) => {
    res.send('Server running');
});

//getAllExercisesWithDetailsforSave()

app.use('/api/v1', routerUsers);
app.use('/api/v1', routerCoach);
app.use('/api/v1', routerClient);
app.use('/api/v1', routerExercises)
app.use('/api/v1', routerRoutine);
app.use('/api/v1', routerProgress);

app.use((_,res) => res.status(404).json({res: "404 - Endpoint not found"}));

const server = createServer(app);
export default server;