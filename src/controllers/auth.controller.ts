import { Request, Response } from "express";
import { register } from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { user, token } = await register(req.body);
        res.status(201).json({ 
            success: true,
            data: { user, token },
            message: 'Registration successful'
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            message: error.message || 'Registration failed'
        });
    }
}