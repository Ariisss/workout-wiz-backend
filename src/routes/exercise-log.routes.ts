import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { deleteExerciseLog, getExerciseLogById, getExerciseLogs, logExercise } from "../controllers/exercise-log.controller";

const router = Router();

router.post('/', authMiddleware, logExercise);
router.get('/', authMiddleware, getExerciseLogs);
router.get('/:id', authMiddleware, getExerciseLogById);
router.delete('/:id', authMiddleware, deleteExerciseLog);

export default router;

