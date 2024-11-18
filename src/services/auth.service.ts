import { comparePasswords, hashPassword, validatePassword } from "../utils/password.utils";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import { UserType, UserRegisterType } from "../types/types";
import { User } from "../models";

export const register = async (user: UserRegisterType) => {
    const existingUser = await User.findOne({ where: { email: user.email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    if (!validatePassword(user.password)) {
        throw new Error('USDFOASDF');
    }

    const hashedPassword = await hashPassword(user.password);
    const newUser = await User.create({ ...user, password: hashedPassword });

    const { password, ...userWithoutPassword } = newUser.get() as UserType;

    return userWithoutPassword;
}
