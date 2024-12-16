import { Request, Response } from "express";
import { computeCaloriesBurned, createLog, deleteLog, getLogById, getLogs } from "../services/exercise-log.service";
import { getUser } from "../services/user.service";
import { PlanExerciseType, UserType } from "../types/types";
import { getPlanExerciseById } from "../services/exercises.service";

export const logExercise = async (req: Request, res: Response) => {
    try{

        const userModel = await getUser(req.user.id);

        // console.log("json body: " + req.body)

        if (!userModel) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = userModel.get() as UserType;
        const { plan_exercise_id } = req.body;
        const exercise = await getPlanExerciseById(plan_exercise_id)
        const plan_exercise = await exercise?.get() as PlanExerciseType

        const caloriesBurned = await computeCaloriesBurned(plan_exercise.duration_mins, plan_exercise_id, user.weight);

        if (!req.body) {
            res.status(400).send({ error: 'Missing required fields' });
            return 
          }

        const exerciseLogData = {
            ...req.body,
            exercise_name: plan_exercise.exercise_name,
            duration_mins: plan_exercise.duration_mins * plan_exercise.sets * plan_exercise.reps,
            user_id: user.user_id,
            calories_burned: caloriesBurned,
            date: new Date()
        }

        const exerciseLog = await createLog(exerciseLogData);
        res.status(201).json({ success: true, data: exerciseLog });

    } catch (error) {
        console.error('Error logging exercise:', error);
        res.status(500).json({ error: 'Failed to log exercise' });
    }
}

export const getExerciseLogs = async (req: Request, res: Response) => {
    try {
        const exerciseLogs = await getLogs(req.user.id);
        res.status(200).json({ success: true, data: exerciseLogs });
    } catch (error) {
        console.error('Error fetching exercise logs:', error);
        res.status(500).json({ error: 'Failed to fetch exercise logs' });
    }
}

export const getExerciseLogById = async (req: Request, res: Response) => {
    try {
        const exerciseLog = await getLogById(parseInt(req.params.log_id));
        res.status(200).json({ success: true, data: exerciseLog });
    } catch (error) {
        console.error('Error fetching exercise log by ID:', error);
        res.status(500).json({ error: 'Failed to fetch exercise log by ID' });
    }
}

export const deleteExerciseLog = async (req: Request, res: Response) => {
    try {
        await deleteLog(parseInt(req.params.log_id));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting exercise log:', error);
        res.status(500).json({ error: 'Failed to delete exercise log' });
    }
}
