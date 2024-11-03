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
router.post('/sign-up',validateUser, userRegister);
router.post('/login', login)



//Private routes
router.put('/users/update-password', verifyAuth, updatePassword);

export default router;