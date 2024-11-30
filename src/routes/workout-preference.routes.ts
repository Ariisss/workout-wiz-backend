import { Router } from "express";
import { createWorkoutPreference, deleteWorkoutPreference, getWorkoutPreferences } from "../controllers/workout-preference.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createWorkoutPreference);
router.get('/', authMiddleware, getWorkoutPreferences);
router.delete('/', authMiddleware, deleteWorkoutPreference);

export default router;