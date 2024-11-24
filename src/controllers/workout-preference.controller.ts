import { Request, Response } from "express";
import { create, get, update, remove } from "../services/workout-preference.service";
import { WorkoutPreferenceType } from "../types/types";
export const createWorkoutPreference = async (req: Request, res: Response) => {
    try{
        if (!req.user?.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const workoutPreference: WorkoutPreferenceType = {
            ...req.body,
            user_id: req.user.id
        };

        const newWorkoutPreference = await create(workoutPreference);
        res.status(201).json(newWorkoutPreference);
    }catch(error){
        res.status(500).json({ error: 'Failed to create workout preference' });
    }
}
