import { Request, Response } from "express";
import { deletePlanExercise, getAllUserExercises, getPlanExerciseById } from "../services/exercises.service";

export const getExercises = async (req: Request, res: Response) => {
    try {
        const exercises = await getAllUserExercises(req.user.id);
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
}

export const deleteExercise = async (req: Request, res: Response) => {
    try {
        await deletePlanExercise(parseInt(req.params.id));
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
}

export const getExerciseById = async (req: Request, res: Response) => {
    try {
        const exercise = await getPlanExerciseById(parseInt(req.params.id));
        res.status(200).json({ success: true, exercise });
    } catch (error) {
        console.error('Error fetching exercise:', error);
        res.status(500).json({ error: 'Failed to fetch exercise' });
    }
}
