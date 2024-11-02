import { Router } from "express";
import {
    userRegister
} from "../controllers/users.controller.js";
import { validateUser } from "../middlewares/users.validation.js";

const router = Router();


router.post('/sign-up',validateUser, userRegister);

export default router;