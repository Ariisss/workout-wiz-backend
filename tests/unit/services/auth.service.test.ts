import { describe, it, expect, vi, beforeEach } from 'vitest';
import { register, login } from '../../../src/services/auth.service';
import { User } from '../../../src/models';
import * as passwordUtils from '../../../src/utils/password.utils';
import * as jwtUtils from '../../../src/utils/jwt.utils';
import { UserType } from '../../../src/types/types';

// Mock the models and utils
vi.mock('../../../src/models', () => ({
    User: {
        findOne: vi.fn(),
        create: vi.fn()
    }
}));

vi.mock('../../../src/utils/password.utils');
vi.mock('../../../src/utils/jwt.utils');

describe('Auth Service', () => {
    const mockUser = {
        email: 'test@example.com',
        password: 'Password123!'
    };

    const mockUserData: UserType = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        username: 'testuser',
        sex: true,
        dob: '1990-01-01',
        height: 170,
        weight: 70,
        weeklyStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockToken = 'mock.jwt.token';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Mock dependencies
            vi.spyOn(User, 'findOne').mockResolvedValue(null);
            vi.spyOn(passwordUtils, 'validatePassword').mockReturnValue(true);
            vi.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('hashedPassword');
            vi.spyOn(User, 'create').mockResolvedValue({
                get: () => mockUserData
            } as any);
            vi.spyOn(jwtUtils, 'generateToken').mockReturnValue(mockToken);

            const result = await register(mockUser);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
            expect(passwordUtils.validatePassword).toHaveBeenCalledWith(mockUser.password);
            expect(passwordUtils.hashPassword).toHaveBeenCalledWith(mockUser.password);
            expect(User.create).toHaveBeenCalledWith({
                email: mockUser.email,
                password: 'hashedPassword',
                weeklyStreak: 0
            });
            expect(result).toEqual({
                user: {
                    id: mockUserData.user_id,
                    email: mockUserData.email
                },
                token: mockToken
            });
        });

        it('should throw error if user already exists', async () => {
            vi.spyOn(User, 'findOne').mockResolvedValue({
                get: () => mockUserData
            } as any);

            await expect(register(mockUser)).rejects.toThrow('User with this email already exists');
        });

        it('should throw error if password is invalid', async () => {
            vi.spyOn(User, 'findOne').mockResolvedValue(null);
            vi.spyOn(passwordUtils, 'validatePassword').mockReturnValue(false);

            await expect(register(mockUser)).rejects.toThrow('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number');
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            // Mock dependencies
            vi.spyOn(User, 'findOne').mockResolvedValue({
                get: () => mockUserData
            } as any);
            vi.spyOn(passwordUtils, 'comparePasswords').mockResolvedValue(true);
            vi.spyOn(jwtUtils, 'generateToken').mockReturnValue(mockToken);

            const result = await login(mockUser);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
            expect(passwordUtils.comparePasswords).toHaveBeenCalledWith(mockUser.password, mockUserData.password);
            expect(result).toEqual({
                user: {
                    id: mockUserData.user_id,
                    email: mockUserData.email
                },
                token: mockToken
            });
        });

        it('should throw error if user not found', async () => {
            vi.spyOn(User, 'findOne').mockResolvedValue(null);

            await expect(login(mockUser)).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password is incorrect', async () => {
            vi.spyOn(User, 'findOne').mockResolvedValue({
                get: () => mockUserData
            } as any);
            vi.spyOn(passwordUtils, 'comparePasswords').mockResolvedValue(false);

            await expect(login(mockUser)).rejects.toThrow('Invalid credentials');
        });
    });
});