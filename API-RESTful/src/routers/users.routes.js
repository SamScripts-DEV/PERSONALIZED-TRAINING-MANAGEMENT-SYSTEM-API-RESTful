import { Router } from "express";
import {
    userRegister,
    login,
    updatePassword
} from "../controllers/users.controller.js";
import { validateUser } from "../middlewares/users.validation.js";
import verifyAuth from "../middlewares/auth.js";

const router = Router();

//Public routes
router.post('/sign-up',validateUser, userRegister); //Regsitra un usuario (usado para administrador)
router.post('/login', login) //inicia sesión para todos los usuarios independientemente del rol



//Private routes
router.put('/users/update-password', verifyAuth, updatePassword); //Actualiza la contraseña una vez proporcionado el token en los headers

export default router;