import { Request, Response } from "express";
import { updateUser, changePassword, deleteUser, updateHealthMetrics } from "../services/user.service";

export const updateUserController = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;
        const updatedFields = req.body;
        const user = await updateUser(parseInt(userId), updatedFields);
        res.json(user);
        res.status(200);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}