import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import routerUsers from './routers/users.routes.js';
import routerCoach from './routers/coach.routes.js';
import routerClient from './routers/client.routes.js';
import routerExercises from './routers/exercises.routes.js';
import {createServer} from 'http';

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

app.use('/api/v1', routerUsers);
app.use('/api/v1', routerCoach);
app.use('/api/v1', routerClient);
app.use('/api/v1', routerExercises)

app.use((_,res) => res.status(404).json({res: "404 - Endpoint not found"}));

const server = createServer(app);
export default server;