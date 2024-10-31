import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//Inicializamos
const app = express();
dotenv.config();

//Configuramos el puerto
app.set('port', process.env.PORT || 3000);
app.use(cors());

//Middlewares
app.use(express.json()); //Transforma los request body en objetos JavaScript


//Rutas
app.get('/', (req, res) => {
    res.send('Server running');
});


export default app;