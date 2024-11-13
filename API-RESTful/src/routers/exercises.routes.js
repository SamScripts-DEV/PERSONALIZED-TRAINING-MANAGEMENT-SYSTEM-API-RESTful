import { Router } from "express";

import {allExercises,typesExercises, getAllExercisesWithDetails, exercisesByID } from "../controllers/exercises.controller.js";

const router = Router();

router.get('/exercises', allExercises)
// router.get('/exercises/details', exercisesByID)
router.get('/exercises/types', typesExercises)


router.get('/exercises/details/all', getAllExercisesWithDetails)

export default router;