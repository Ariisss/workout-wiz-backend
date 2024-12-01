import { Request, Response } from "express";
import { WorkoutPlan } from "../models";
import { create, get, update, remove } from "../services/workout-preference.service";

export const createWorkoutPlan = async (req: Request, res: Response) => {
    try {
        const workoutPlan = await WorkoutPlan.create(req.body);
        res.status(200).json({
            success: true,
            data: workoutPlan
        });
    } catch (error) {
        console.error('Workout Plan Creation Error:', error);
        res.status(500).json({
            error: 'Failed to create workout plan',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const getWorkoutPlan = async (req: Request, res: Response) => {
    try {
        const workoutPlan = await get(parseInt(req.params.id));
        res.status(200).json({
            success: true,
            data: workoutPlan
        });
    } catch (error) {
        console.error('Workout Plan Retrieval Error:', error);
        res.status(500).json({
            error: 'Failed to retrieve workout plan',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
