import { Router } from "express";
import { createWorkoutPreference, getWorkoutPreferences } from "../controllers/workout-preference.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createWorkoutPreference);
router.get('/', authMiddleware, getWorkoutPreferences);

export default router;