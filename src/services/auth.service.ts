import { comparePasswords, hashPassword } from "../utils/password.utils";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import { UserType, UserRegisterType } from "../types/types";
import { User } from "../models";

export const register = async (user: UserRegisterType) => {
    const hashedPassword = await hashPassword(user.password);
    const newUser = await User.create({ ...user, password: hashedPassword });
    return newUser;
}