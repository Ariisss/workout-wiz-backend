import { User } from "../models";
import { UserType } from "../types/types";
import { hashPassword } from "../utils/password.utils";

export const getUser = async (userId: number) => {
    const user = await User.findByPk(userId);
    return user;
}

// update user
// takes userId and updated fields, returns updated user
export const updateUser = async (userId: number, updatedFields: Partial<UserType>) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return await user.update(updatedFields);
}

// change password
// takes userId and new password, validates and hashes new password
export const changePassword = async (userId: number, newPassword: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = hashPassword(newPassword);

    return await user.update({ password: hashedPassword });
}

// delete user
// takes userId and performs cleanup/deletion

// update user health metrics
// takes userId and updated weight/height/age, returns updated user

// validate username
// takes username string and returns boolean

// validate email
// takes email string and returns boolean
