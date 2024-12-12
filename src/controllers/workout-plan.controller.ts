import { Request, Response } from "express";
import { getPlanById, deletePlan, getAllPlans, getPlansAndExercises } from "../services/workout-plan.service";
import { generateWorkoutPlans } from "../services/ai.service";
import { getPreference } from "../services/workout-preference.service";
import { WorkoutPreferenceType } from "../types/types";
import { GoalType, IntensityLevel } from "../types/workout-types";

export const generateFromPreferences = async (req: Request, res: Response) => {
    try {
        const preferences = await getPreference(req.user.id);
        
        if (!preferences || preferences.length === 0) {
            res.status(404).json({
                error: 'No preferences found for this user'
            });
            return;
        }
 
        console.log("Preferences: ", preferences);

        const [currentPreference] = preferences;
        
        console.log("Current Preferences: ", currentPreference)

        const workoutPreference: WorkoutPreferenceType = {
            ...currentPreference.get(),
            goal_type: currentPreference.get('goal_type')
        };

        const workoutPlan = await generateWorkoutPlans(workoutPreference);
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

export const getWorkoutPlanExercises = async (req: Request, res: Response) => {
    try{
        const exercises = await getPlansAndExercises(req.user.id);
        res.status(200).json({
            success: true,
            data: exercises
        });
    } catch (error) {
        console.error('Workout Plan Exercises Retrieval Error:', error);
        res.status(500).json({
            error: 'Failed to retrieve workout plan exercises',
            details: error instanceof Error ? error.message : 'Unknown error'
        }); 
    }
}
