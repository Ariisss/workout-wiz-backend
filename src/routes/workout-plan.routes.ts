import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { generateFromPreferences, createWorkoutPlan, getWorkoutPlan } from "../controllers/workout-plan.controller";

const router = Router();

router.post('/generate/preferences', authMiddleware, generateFromPreferences);
router.post('/generate', authMiddleware, createWorkoutPlan);
router.get('/:id', authMiddleware, getWorkoutPlan);

export default router;

