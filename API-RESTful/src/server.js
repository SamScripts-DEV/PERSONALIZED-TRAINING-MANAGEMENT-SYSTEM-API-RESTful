import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import routerUsers from './routers/users.routes.js';
import routerCoach from './routers/coach.routes.js';
import {createServer} from 'http';

//Inicializamos
const app = express();


//Configuramos el puerto

app.use(cors());


app.use(express.json()); 


//Rutas
app.get('/', (_, res) => {
    res.send('Server running');
});

app.use('/api/v1', routerUsers);
app.use('/api/v1', routerCoach);

app.use((_,res) => res.status(404).json({res: "404 - Endpoint not found"}));

const server = createServer(app);
export default server;