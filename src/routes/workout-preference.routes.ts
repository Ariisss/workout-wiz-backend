import { Router } from "express";
import { createWorkoutPreference } from "../controllers/workout-preference.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post('/', authMiddleware, createWorkoutPreference);

export default router;