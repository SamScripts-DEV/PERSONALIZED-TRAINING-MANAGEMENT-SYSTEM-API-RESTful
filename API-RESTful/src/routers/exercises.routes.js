import { Router } from "express";

import {allExercises,typesExercises } from "../controllers/exercises.controller.js";

const router = Router();

router.get('/exercises', allExercises)
router.get('/exercises/types', typesExercises)

export default router;