import { Request, Response } from "express";
import { computeCaloriesBurned, createExerciseLog } from "../services/exercise-log.service";

export const logExercise = async (req: Request, res: Response) => {
    try{
        const { duration_mins, plan_exercise_id, weight_kg } = req.body;
        const caloriesBurned = await computeCaloriesBurned(duration_mins, plan_exercise_id, weight_kg);
        const exerciseLog = await createExerciseLog(req.body, caloriesBurned);
        res.status(201).json({ success: true, data: exerciseLog });
    } catch (error) {
        console.error('Error logging exercise:', error);
        res.status(500).json({ error: 'Failed to log exercise' });
    }
}
