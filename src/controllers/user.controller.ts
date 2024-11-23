import { Request, Response } from "express";
import { update, changePassword, deleteUser, updateHealthMetrics } from "../services/user.service";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const updatedFields = req.body;

        if (!userId) {
             res.status(400).json({ error: 'id is required' });
             return
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
             res.status(400).json({ error: 'invalid id format' });
             return
        }

        const user = await update(parsedUserId, updatedFields);
        
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
        }

         res.status(200).json({
            success: true,
            message: 'User updated successfully',
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!userId) {
            res.status(400).json({ error: 'id is required' });
            return
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            res.status(400).json({ error: 'invalid id format' });
            return
        }

        const user = await changePassword(parsedUserId, newPassword);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
        }

         res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    }catch(error){
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeUser = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ error: 'id is required' });
            return
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            res.status(400).json({ error: 'invalid id format' });
            return
        }

        const user = await deleteUser(parsedUserId);

         res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });

    }catch(error){
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}


