import { Request, Response } from "express";
import { create, get, update, remove } from "../services/workout-preference.service";
import { WorkoutPreferenceType } from "../types/types";
import { generateWorkoutPlans } from "../services/ai.service";

export const createWorkoutPreference = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ error: 'User not authenticated' });
            return
        }

        const workoutPreference: WorkoutPreferenceType = {
            ...req.body,
            user_id: req.user.id
        };

        const newWorkoutPreference = await create(workoutPreference);
        if (!newWorkoutPreference) {
            res.status(400).json({ error: 'Failed to create workout preference' });
            return;
        }

        try {
            const workoutPlans = await generateWorkoutPlans(newWorkoutPreference.get());
            
            res.status(201).json({
                success: true,
                data: {
                    preference: newWorkoutPreference,
                    plans: workoutPlans
                }
            });
            return;
        } catch (aiError) {
            console.error('AI Generation Error:', aiError);
            res.status(201).json({
                success: true,
                data: {
                    preference: newWorkoutPreference
                },
                warning: 'Workout plans could not be generated at this time'
            });
            return
        }
    } catch (error) {
        console.error('Preference Creation Error:', error);
        res.status(500).json({ 
            error: 'Failed to create workout preference',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
};

export const getWorkoutPreferences = async (req: Request, res: Response) => {

    try{
        if (!req.user?.id) {
            res.status(401).json({ error: 'User not authenticated' });
            return
        }

        const workoutPreferences = await get(req.user.id);

        res.status(200).json({
            success: true,
            data: workoutPreferences
        });
        return;
    } catch (error) {
        console.error('Preference Retrieval Error:', error);
        res.status(500).json({ 
            error: 'Failed to retrieve workout preferences',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
}
