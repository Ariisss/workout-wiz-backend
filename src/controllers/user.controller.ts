import { Request, Response } from "express";
import { update, changePassword, deleteUser, updateHealthMetrics } from "../services/user.service";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const parsedUserId = parseInt(req.params.userId);
        if (!parsedUserId || isNaN(parsedUserId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
 
        const user = await update(parsedUserId, req.body);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Internal server error'
        });
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try{
        const parsedUserId = parseInt(req.params.userId); 
        if(!parsedUserId || isNaN(parsedUserId)){
            res.status(400).json({ error: 'Invalid user ID' });
            return
        }

        const user = await changePassword(parsedUserId, req.body.newPassword);
        if(!user){
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

        const success = await deleteUser(parsedUserId);
        if(!success){
            res.status(404).json({ error: 'Deletion failed' });
            return
        }

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


