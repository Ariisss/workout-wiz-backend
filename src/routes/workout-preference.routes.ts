import { Router } from "express";
import { createWorkoutPreference, deleteWorkoutPreference, getWorkoutPreferences, updateWorkoutPreference } from "../controllers/workout-preference.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createWorkoutPreference);
router.get('/', authMiddleware, getWorkoutPreferences);
router.delete('/:id', authMiddleware, deleteWorkoutPreference);
router.put('/:id', authMiddleware, updateWorkoutPreference);

export default router;