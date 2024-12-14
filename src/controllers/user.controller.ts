import { Request, Response } from "express";
import { update, changePassword, deleteUser, getUser } from "../services/user.service";

export const updateUser = async (req: Request, res: Response) => {
    try {
        const parsedUserId = req.user.id;

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
    try {
        const parsedUserId = req.user.id;
        const { oldPassword, newPassword } = req.body.values

        if (!parsedUserId || isNaN(parsedUserId)) {
            res.status(400).json({ error: 'Invalid credentials' });
            return
        }

        const user = await changePassword(parsedUserId, oldPassword, newPassword);
        if (!user) {
            res.status(403).json({ error: 'Invalid Credentials' });
            return
        }

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            res.status(400).json({ error: 'invalid id format' });
            return
        }

        const success = await deleteUser(parsedUserId);
        if (!success) {
            res.status(404).json({ error: 'Deletion failed' });
            return
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
            return
        }
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await getUser(req.user.id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

