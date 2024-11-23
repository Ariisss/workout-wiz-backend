import { Request, Response } from "express";
import { updateUser, changePassword, deleteUser, updateHealthMetrics } from "../services/user.service";

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const updatedFields = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'id is required' });
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ error: 'invalid id format' });
        }

        const user = await updateUser(parsedUserId, updatedFields);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}