import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    try {
        const SALT_ROUNDS = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
        throw new Error('Password hashing failed');
    }
}

export async function comparePasswords(
    plainPassword: string, 
    hashedPassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}

export function validatePassword(password: string): boolean {
    // min 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}