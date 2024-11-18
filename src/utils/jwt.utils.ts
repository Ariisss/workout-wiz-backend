import jwt from "jsonwebtoken";
import env from "../config/environment";

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
};
