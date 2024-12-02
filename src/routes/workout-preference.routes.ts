import { Router } from "express";
import { createWorkoutPreference, deleteWorkoutPreference, getWorkoutPreferences, updateWorkoutPreference } from "../controllers/workout-preference.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createWorkoutPreference);
router.get('/', authMiddleware, getWorkoutPreferences);
router.delete('/', authMiddleware, deleteWorkoutPreference);
router.put('/', authMiddleware, updateWorkoutPreference);

export default router;