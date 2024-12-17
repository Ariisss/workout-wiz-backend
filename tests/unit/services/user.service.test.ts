import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUser, update, changePassword, deleteUser } from '../../../src/services/user.service';
import { User } from '../../../src/models';
import * as passwordUtils from '../../../src/utils/password.utils';
import { UserType } from '../../../src/types/types';

// mock models
vi.mock('../../../src/models', () => ({
    User: {
        findByPk: vi.fn(),
        update: vi.fn(),
        increment: vi.fn(),
        findAll: vi.fn()
    }
}));

vi.mock('../../../src/utils/password.utils');

describe('User Service', () => {
    const mockUserId = 1;

    const mockUser: UserType = {
        user_id: mockUserId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123',
        sex: true,
        dob: '1990-01-01',
        height: 175,
        weight: 70,
        weeklyStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUser', () => {
        it('should retrieve a user by ID', async () => {
            const mockUserWithoutPassword = {
                user_id: mockUser.user_id,
                username: mockUser.username,
                email: mockUser.email,
                sex: mockUser.sex,
                dob: mockUser.dob,
                height: mockUser.height,
                weight: mockUser.weight,
                weeklyStreak: mockUser.weeklyStreak,
                createdAt: mockUser.createdAt,
                updatedAt: mockUser.updatedAt
            };

            const mockUserInstance = {
                get: () => mockUserWithoutPassword
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);

            const result = await getUser(mockUserId);

            expect(User.findByPk).toHaveBeenCalledWith(mockUserId, {
                attributes: {
                    exclude: ['password']
                }
            });
            expect(result).toBe(mockUserInstance);
        });
    });

    describe('update', () => {
        it('should update user fields', async () => {
            const updatedFields = {
                username: 'newusername',
                height: 180
            };

            const mockUserInstance = {
                get: () => mockUser,
                update: vi.fn().mockResolvedValue({ ...mockUser, ...updatedFields })
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);

            const result = await update(mockUserId, updatedFields);

            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUserInstance.update).toHaveBeenCalledWith(updatedFields);
            expect(result).toEqual(expect.objectContaining(updatedFields));
        });

        it('should throw error if user not found', async () => {
            vi.spyOn(User, 'findByPk').mockResolvedValue(null as any);

            await expect(update(mockUserId, { username: 'newname' }))
                .rejects.toThrow('User not found');
        });
    });

    describe('changePassword', () => {
        it('should change user password', async () => {
            const oldPassword = 'oldPassword123';
            const newPassword = 'newPassword123';
            const newHashedPassword = 'newHashedPassword123';

            const mockUserInstance = {
                get: () => mockUser,
                update: vi.fn().mockResolvedValue({ ...mockUser, password: newHashedPassword })
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);
            vi.spyOn(passwordUtils, 'comparePasswords').mockResolvedValue(true);
            vi.spyOn(passwordUtils, 'hashPassword').mockResolvedValue(newHashedPassword);

            const result = await changePassword(mockUserId, oldPassword, newPassword);

            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(passwordUtils.comparePasswords).toHaveBeenCalledWith(oldPassword, mockUser.password);
            expect(passwordUtils.hashPassword).toHaveBeenCalledWith(newPassword);
            expect(mockUserInstance.update).toHaveBeenCalledWith({ password: newHashedPassword });
            expect(result).toEqual(expect.objectContaining({ password: newHashedPassword }));
        });

        it('should throw error if user not found', async () => {
            vi.spyOn(User, 'findByPk').mockResolvedValue(null as any);

            await expect(changePassword(mockUserId, 'old', 'new'))
                .rejects.toThrow('Invalid credentials.');
        });

        it('should throw error if old password is invalid', async () => {
            const mockUserInstance = {
                get: () => mockUser
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);
            vi.spyOn(passwordUtils, 'comparePasswords').mockResolvedValue(false);

            await expect(changePassword(mockUserId, 'wrongPassword', 'new'))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            const mockUserInstance = {
                get: () => mockUser,
                destroy: vi.fn().mockResolvedValue(undefined)
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);

            const result = await deleteUser(mockUserId);

            expect(User.findByPk).toHaveBeenCalledWith(mockUserId);
            expect(mockUserInstance.destroy).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it('should throw error if user not found', async () => {
            vi.spyOn(User, 'findByPk').mockResolvedValue(null as any);

            await expect(deleteUser(mockUserId))
                .rejects.toThrow('User not found');
        });

        it('should return false if deletion fails', async () => {
            const mockUserInstance = {
                get: () => mockUser,
                destroy: vi.fn().mockRejectedValue(new Error('Database error'))
            };

            vi.spyOn(User, 'findByPk').mockResolvedValue(mockUserInstance as any);

            const result = await deleteUser(mockUserId);

            expect(result).toBe(false);
        });
    });
});