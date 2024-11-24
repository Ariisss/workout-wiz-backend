import { Request, Response } from "express";
import { create, get, update, remove } from "../services/workout-preference.service";

export const createWorkoutPreference = async (req: Request, res: Response) => {
    try{
        const workoutPreference = req.body;
        const newWorkoutPreference = await create(workoutPreference);
        res.status(201).json(newWorkoutPreference);
    }catch(error){
        res.status(500).json({ error: 'Failed to create workout preference' });
    }
}
