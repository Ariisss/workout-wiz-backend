import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { createWorkoutPreference, getWorkoutPreferences, deleteWorkoutPreference, updateWorkoutPreference } from '../../../src/controllers/workout-preference.controller';
import * as workoutPreferenceService from '../../../src/services/workout-preference.service';
import { WorkoutPreferenceType } from '../../../src/types/types';
import { Model } from 'sequelize';

// Mock services
vi.mock('../../../src/services/workout-preference.service');

interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

describe('Workout Preference Controller', () => {
    let mockRequest: Partial<CustomRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: ReturnType<typeof vi.fn>;
    let mockStatus: ReturnType<typeof vi.fn>;
    let mockPreference: WorkoutPreferenceType;

    beforeEach(() => {
        mockJson = vi.fn();
        mockStatus = vi.fn().mockReturnValue({ json: mockJson });
        mockResponse = {
            status: mockStatus,
            json: mockJson
        };
        mockRequest = {
            user: { id: 1 }
        };
        mockPreference = {
            preference_id: 1,
            user_id: 1,
            goal_type: 'STRENGTH',
            with_gym: true,
            workout_days: '1,2,3',
            intensity: 'Intermediate'
        };
    });

    describe('createWorkoutPreference', () => {
        it('should create a new workout preference', async () => {
            const mockNewPreference = {
                get: () => mockPreference,
                dataValues: mockPreference
            } as any;

            vi.spyOn(workoutPreferenceService, 'createPreference').mockResolvedValue(mockNewPreference);
            mockRequest.body = {
                goal_type: 'STRENGTH',
                with_gym: true,
                workout_days: '1,2,3',
                intensity: 'Intermediate'
            };

            await createWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: {
                    preference: mockNewPreference
                },
                message: 'Workout preference created successfully'
            });
        });

        it('should handle creation failure', async () => {
            vi.spyOn(workoutPreferenceService, 'createPreference').mockResolvedValue(null as unknown as Model<any, any>);
            mockRequest.body = {
                goal_type: 'STRENGTH',
                with_gym: true,
                workout_days: '1,2,3',
                intensity: 'Intermediate'
            };

            await createWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to create workout preference'
            });
        });

        it('should handle errors during creation', async () => {
            vi.spyOn(workoutPreferenceService, 'createPreference').mockRejectedValue(new Error('Database error'));
            mockRequest.body = {
                goal_type: 'STRENGTH',
                with_gym: true,
                workout_days: '1,2,3',
                intensity: 'Intermediate'
            };

            await createWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to create workout preference',
                details: 'Database error'
            });
        });
    });

    describe('getWorkoutPreferences', () => {
        it('should get workout preferences', async () => {
            const mockPreferences = [{
                get: () => mockPreference,
                dataValues: mockPreference
            }] as any[];

            vi.spyOn(workoutPreferenceService, 'getPreference').mockResolvedValue(mockPreferences);

            await getWorkoutPreferences(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockPreferences
            });
        });

        it('should handle errors when getting preferences', async () => {
            vi.spyOn(workoutPreferenceService, 'getPreference').mockRejectedValue(new Error('Database error'));

            await getWorkoutPreferences(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to retrieve workout preferences',
                details: 'Database error'
            });
        });
    });

    describe('deleteWorkoutPreference', () => {
        it('should delete workout preference', async () => {
            vi.spyOn(workoutPreferenceService, 'removePreferences').mockResolvedValue(1);

            await deleteWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'Workout preference deleted successfully'
            });
        });

        it('should handle errors when deleting preference', async () => {
            vi.spyOn(workoutPreferenceService, 'removePreferences').mockRejectedValue(new Error('Database error'));

            await deleteWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to delete workout preference',
                details: 'Database error'
            });
        });
    });

    describe('updateWorkoutPreference', () => {
        it('should update workout preference', async () => {
            const mockUpdatedPreferences = [{
                get: () => mockPreference,
                dataValues: mockPreference
            }] as any[];

            vi.spyOn(workoutPreferenceService, 'updatePreferences').mockResolvedValue([1]);
            vi.spyOn(workoutPreferenceService, 'getPreference').mockResolvedValue(mockUpdatedPreferences);

            mockRequest.body = {
                goal_type: 'STRENGTH',
                with_gym: true,
                workout_days: '1,2,3,4',
                intensity: 'High'
            };

            await updateWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockUpdatedPreferences
            });
        });

        it('should handle errors when updating preference', async () => {
            vi.spyOn(workoutPreferenceService, 'updatePreferences').mockRejectedValue(new Error('Database error'));

            mockRequest.body = {
                goal_type: 'STRENGTH',
                with_gym: true,
                workout_days: '1,2,3,4',
                intensity: 'High'
            };

            await updateWorkoutPreference(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to update workout preference',
                details: 'Database error'
            });
        });
    });
});