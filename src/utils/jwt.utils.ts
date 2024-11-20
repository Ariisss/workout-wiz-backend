import jwt from "jsonwebtoken";
import env from "../config/environment";
import { JwtPayload } from "../types/types";

export const generateToken = (user: JwtPayload): string => {
    return jwt.sign({ 
        id: user.id,
        email: user.email,
        username: user.username
     }, env.JWT_SECRET, { expiresIn: '6h' });
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};