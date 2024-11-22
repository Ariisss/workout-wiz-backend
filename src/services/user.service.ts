import { User } from "../models";

export const getUser = async (userId: number) => {
    const user = await User.findByPk(userId);
    return user;
}

// update user
// takes userId and updated fields, returns updated user

// change password
// takes userId and new password, validates and hashes new password

// delete user
// takes userId and performs cleanup/deletion

// update user health metrics
// takes userId and updated weight/height/age, returns updated user

// validate username
// takes username string and returns boolean

// validate email
// takes email string and returns boolean
