import { Router } from "express";
import{
    clientRegisterAll,
    clientRegisterOnly,
    confirmEmail,
    configureClienProfile
} from "../controllers/client.controller.js";
import { validateClient } from "../middlewares/client.validation.js";
import verifyAuth from "../middlewares/auth.js";
import { validateUser } from "../middlewares/users.validation.js";

const router = Router();


//Rutas publicas
router.post("/client/register",validateClient, clientRegisterAll);  //Registra al cliente con todo los datos del perfil incliudos

router.post("/client/only-register",validateUser, clientRegisterOnly); //Registra al cliente con solo email y password

router.get("/client/confirm-email/:token", confirmEmail); //Confirma el email del cliente

//Rutas privadas

router.put("/client/configure-profile",verifyAuth, configureClienProfile); //Configura el perfil del cliente
export default router