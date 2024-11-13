import { Router } from "express";

import {allExercises, getAllExercisesWithDetails, exercisesByID } from "../controllers/exercises.controller.js";

const router = Router();

router.get('/exercises', allExercises)
 router.get('/exercises/details', exercisesByID)



router.get('/exercises/details/all', getAllExercisesWithDetails)//Muestra todos los ejercicios con detalle

export default router;