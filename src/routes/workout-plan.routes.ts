import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { updateActiveWorkoutPlan, generateFromPreferences, createWorkoutPlan, getWorkoutPlan, deleteWorkoutPlan, getWorkoutPlanExercises, getAllWorkoutPlans } from "../controllers/workout-plan.controller";

const router = Router();

router.post('/generate/preferences', authMiddleware, generateFromPreferences);
router.post('/generate', authMiddleware, createWorkoutPlan);
router.get('/:id', authMiddleware, getWorkoutPlan);
router.delete('/:id', authMiddleware, deleteWorkoutPlan);
router.get('/', authMiddleware, getWorkoutPlanExercises);
router.get('/plans', authMiddleware, getAllWorkoutPlans)
router.put('/switch/:id', authMiddleware, updateActiveWorkoutPlan);

export default router;

