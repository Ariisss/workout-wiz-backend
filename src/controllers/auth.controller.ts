import { Request, Response } from "express";
import { register } from "../services/auth.service";
import { generateToken } from "../utils/jwt.utils";

export const registerController = async (req: Request, res: Response) => {
    try {
        const user = await register(req.body);
        res.status(201).json({ 
            success: true,
            data: {
                user: {
                    "id": 1,
                    "username": "johndoe",
                    "email": "john@example.com",
                    "first_name": "John",
                    "last_name": "Doe"
                },
                token: generateToken(user.id)
            },
            message: 'Registration successful'
        });
    } catch (error: any) {
        res.status(400).json({ 
            success: false,
            message: error.message
        });
    }
}