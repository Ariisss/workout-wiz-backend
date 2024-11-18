import jwt from "jsonwebtoken";
import env from "../config/environment";

export const generateToken = (payload: number): string => {
    return jwt.sign({ id: payload }, env.JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, env.JWT_SECRET);
};