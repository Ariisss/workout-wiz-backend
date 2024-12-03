import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { generateFromPreferences, createWorkoutPlan, getWorkoutPlan, deleteWorkoutPlan, getWorkoutPlanExercises } from "../controllers/workout-plan.controller";

const router = Router();

router.post('/generate/preferences', authMiddleware, generateFromPreferences);
router.post('/generate', authMiddleware, createWorkoutPlan);
router.get('/:id', authMiddleware, getWorkoutPlan);
router.delete('/:id', authMiddleware, deleteWorkoutPlan);
router.get('/', authMiddleware, getWorkoutPlanExercises);

export default router;

