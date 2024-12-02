import { Request, Response } from "express";
import { WorkoutPlan } from "../models";
import { createPlan, getPlanById, deletePlan } from "../services/workout-plan.service";
import { generateWorkoutPlans } from "../services/ai.service";

export const generateFromPreferences = async (req: Request, res: Response) => {
    try {
        const { preferences } = req.body;
        const workoutPlan = await generateWorkoutPlans(preferences);
        res.status(200).json({
            success: true,
            data: workoutPlan
        });
    } catch (error) {
        console.error('Workout Plan Generation Error:', error);
        res.status(500).json({
            error: 'Failed to generate workout plan',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const createWorkoutPlan = async (req: Request, res: Response) => {
    try {
        const workoutPlan = await generateWorkoutPlans(req.body);
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
        const workoutPlan = await getPlanById(parseInt(req.params.id));
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

export const deleteWorkoutPlan = async (req: Request, res: Response) => {
    try {
        await deletePlan(parseInt(req.params.id));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Workout Plan Deletion Error:', error);
        res.status(500).json({
            error: 'Failed to delete workout plan',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
