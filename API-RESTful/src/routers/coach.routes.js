import { Router } from "express";
import {
    coachRegister,
    viewCoaches,
    viewCoachById,
    updateCoach,
    deleteCoach,
    getClientsByCoach,
    getClientByCoachById 
} from "../controllers/coach.controller.js";
import verifyAuth from "../middlewares/auth.js";


const router = Router();

//Public routes

router.post('/coach/register', coachRegister);  //Registra un entrenador

//Private routes
router.get('/coach/view-coaches',verifyAuth, viewCoaches); //Muestra todos los entrenadores
router.get('/coach/view-coach/:id',verifyAuth, viewCoachById); //Muestra un entrenador por id
router.put('/coach/update-coach/:id',verifyAuth, updateCoach); //Actualiza un entrenador por id
router.delete('/coach/delete-coach/:id',verifyAuth, deleteCoach); //Elimina un entrenador por id
router.get('/coach/get-clients',verifyAuth, getClientsByCoach); //Muestra los clientes de un entrenador por id
router.get('/coach/get-client/:clientID',verifyAuth, getClientByCoachById); //Muestra el detalle de un solo cliente




export default router;