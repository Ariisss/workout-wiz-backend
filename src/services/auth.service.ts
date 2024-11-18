import { comparePasswords, hashPassword, validatePassword } from "../utils/password.utils";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import { UserType, UserRegisterType } from "../types/types";
import { User } from "../models";

export const register = async (user: UserRegisterType) => {

    const existingUser = await User.findOne({ where: { email: user.email } });
    // console.log("ASDASD")
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    if (!validatePassword(user.password)) {
        // console.log('USDFOASDF');
        throw new Error('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number');
    }

    // console.log("JKLJKL")
    const hashedPassword = await hashPassword(user.password);
    const newUser = await User.create({ ...user, password: hashedPassword });

    // console.log("test")
    const { password, ...userWithoutPassword } = newUser.get() as UserType;

    return {
        user: {
            id: userWithoutPassword.user_id,
            email: userWithoutPassword.email,
            username: userWithoutPassword.username
        },
        token: generateToken(userWithoutPassword.user_id)
    };
}
