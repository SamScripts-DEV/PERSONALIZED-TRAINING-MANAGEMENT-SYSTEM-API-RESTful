import { Router } from "express";
import{
    clientRegisterAll,
    clientRegisterOnly,
    confirmEmail,
    configureClienProfile,
    viewRoutineForClient,
    viewClientProfile,
    deleteClient
} from "../controllers/client.controller.js";
import { validateClient } from "../middlewares/client.validation.js";
import verifyAuth from "../middlewares/auth.js";
import { validateUser } from "../middlewares/users.validation.js";

const router = Router();


//Rutas publicas
router.post("/client/register",validateClient, clientRegisterAll);  //Registra al cliente con todo los datos del perfil incliudos



router.post("/client/only-register",validateUser, clientRegisterOnly); //Registra al cliente con solo email y password

router.post("/client/confirm-email", confirmEmail); //Confirma el email del cliente

//Rutas privadas

router.post("/client/configure-profile",verifyAuth, configureClienProfile); //Configura el perfil del cliente

router.get("/client/view-routine",verifyAuth, viewRoutineForClient); //Muestra la rutina del cliente

router.get("/client/view-profile",verifyAuth, viewClientProfile); //Muestra el perfil del cliente

router.delete("/client/delete/:clientID",verifyAuth, deleteClient); //Elimina al cliente


export default router