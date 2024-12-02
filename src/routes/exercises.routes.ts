import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getExercises, deleteExercise, getExerciseById } from "../controllers/exercises.controller";

const router = Router();

router.get('/', authMiddleware, getExercises);
router.delete('/:id', authMiddleware, deleteExercise);
router.get('/:id', authMiddleware, getExerciseById);

export default router;