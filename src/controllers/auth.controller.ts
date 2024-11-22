import { Request, Response } from "express";
import { register } from "../services/auth.service";
import { generateToken } from "../utils/jwt.utils";

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