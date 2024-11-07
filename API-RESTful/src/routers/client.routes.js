import { Router } from "express";
import{
    clientRegister
} from "../controllers/client.controller.js";
import { validateClient } from "../middlewares/client.validation.js";

const router = Router();


//Rutas publicas
router.post("/client/register",validateClient, clientRegister);