import { Request, Response } from "express";
import { register, login } from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
    try {
        const result = await register(req.body);
        res.status(201).json({ 
            success: true,
            data: result,
            message: 'Registration successful'
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const result = await login(req.body);
        res.status(200).json({ 
            success: true,
            data: result,
            message: 'Login successful'
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}

export const logoutController = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({
            error: 'Failed to logout',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
