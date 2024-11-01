import { Router } from "express";
import {
    userRegister
} from "../controllers/users.controller.js";

const router = Router();


router.post('/sign-up', userRegister);

export default router;