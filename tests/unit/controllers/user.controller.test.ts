import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { updateUser, updatePassword, removeUser, getUserProfile } from '../../../src/controllers/user.controller';
import * as userService from '../../../src/services/user.service';
import { UserType } from '../../../src/types/types';

vi.mock('../../../src/services/user.service');

interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

describe('User Controller', () => {
    let mockRequest: Partial<CustomRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: ReturnType<typeof vi.fn>;
    let mockStatus: ReturnType<typeof vi.fn>;
    let mockUser: UserType;

    beforeEach(() => {
        mockJson = vi.fn();
        mockStatus = vi.fn().mockReturnValue({ json: mockJson });
        mockResponse = {
            status: mockStatus,
            json: mockJson,
        };
        mockRequest = {
            user: { id: 1 },
            body: {},
            params: {},
        };
        mockUser = {
            user_id: 1,
            username: 'testuser',
            email: 'test@test.com',
            password: 'hashedpass',
            sex: true,
            dob: '1990-01-01',
            height: 170,
            weight: 70,
            weeklyStreak: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    describe('updateUser', () => {
        it('should successfully update user', async () => {
            vi.spyOn(userService, 'update').mockResolvedValue({
                get: () => mockUser,
                toJSON: () => mockUser,
                dataValues: mockUser,
                ...mockUser
            } as any);

            mockRequest.body = {
                username: 'newusername',
                height: 175
            };

            await updateUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'User updated successfully'
            });
        });

        it('should handle user not found', async () => {
            vi.spyOn(userService, 'update').mockRejectedValue(new Error('User not found'));

            await updateUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should handle update error', async () => {
            vi.spyOn(userService, 'update').mockRejectedValue(new Error('Update failed'));

            await updateUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Update failed' });
        });
    });

    describe('updatePassword', () => {
        it('should successfully update password', async () => {
            vi.spyOn(userService, 'changePassword').mockResolvedValue({
                get: () => mockUser,
                toJSON: () => mockUser,
                dataValues: mockUser,
                ...mockUser
            } as any);

            mockRequest.body = {
                oldPassword: 'oldpass',
                newPassword: 'newpass'
            };

            await updatePassword(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'Password updated successfully'
            });
        });

        it('should handle invalid credentials', async () => {
            vi.spyOn(userService, 'changePassword').mockRejectedValue(new Error('Invalid credentials.'));

            mockRequest.body = {
                oldPassword: 'wrongpass',
                newPassword: 'newpass'
            };

            await updatePassword(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid credentials.' });
        });

        it('should handle invalid user id', async () => {
            mockRequest.user = { id: NaN };

            await updatePassword(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        it('should handle password update error', async () => {
            vi.spyOn(userService, 'changePassword').mockRejectedValue(new Error('Invalid old password'));

            mockRequest.body = {
                oldPassword: 'wrongpass',
                newPassword: 'newpass'
            };

            await updatePassword(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid old password' });
        });
    });

    describe('removeUser', () => {
        it('should successfully delete user', async () => {
            vi.spyOn(userService, 'deleteUser').mockResolvedValue(true);
            mockRequest.params = { userId: '1' };

            await removeUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'User deleted successfully'
            });
        });

        it('should handle invalid user id format', async () => {
            mockRequest.params = { userId: 'invalid' };

            await removeUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'invalid id format' });
        });

        it('should handle deletion failure', async () => {
            vi.spyOn(userService, 'deleteUser').mockResolvedValue(false);
            mockRequest.params = { userId: '1' };

            await removeUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Deletion failed' });
        });

        it('should handle delete error', async () => {
            vi.spyOn(userService, 'deleteUser').mockRejectedValue(new Error('Delete failed'));
            mockRequest.params = { userId: '1' };

            await removeUser(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Delete failed' });
        });
    });

    describe('getUserProfile', () => {
        it('should successfully return user profile', async () => {
            vi.spyOn(userService, 'getUser').mockResolvedValue({
                get: () => mockUser,
                toJSON: () => mockUser,
                dataValues: mockUser,
                ...mockUser
            } as any);

            await getUserProfile(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                ...mockUser,
                dataValues: mockUser,
                get: expect.any(Function),
                toJSON: expect.any(Function)
            });
        });

        it('should handle user not found', async () => {
            vi.spyOn(userService, 'getUser').mockResolvedValue(null);

            await getUserProfile(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should handle get profile error', async () => {
            vi.spyOn(userService, 'getUser').mockRejectedValue(new Error('Database error'));

            await getUserProfile(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });
});