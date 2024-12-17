import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { generateFromPreferences, createWorkoutPlan, getWorkoutPlan, deleteWorkoutPlan, getWorkoutPlanExercises, getAllWorkoutPlans, updateActiveWorkoutPlan } from '../../../src/controllers/workout-plan.controller';
import * as workoutPlanService from '../../../src/services/workout-plan.service';
import * as aiService from '../../../src/services/ai.service';
import * as workoutPreferenceService from '../../../src/services/workout-preference.service';

// Mock services
vi.mock('../../../src/services/workout-plan.service');
vi.mock('../../../src/services/ai.service');
vi.mock('../../../src/services/workout-preference.service');

interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

describe('Workout Plan Controller', () => {
    let mockRequest: Partial<CustomRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: ReturnType<typeof vi.fn>;
    let mockStatus: ReturnType<typeof vi.fn>;

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
    });

    describe('generateFromPreferences', () => {
        it('should generate workout plan from user preferences', async () => {
            const mockPreference = {
                get: (key?: string) => {
                    const data = { goal_type: 'STRENGTH' };
                    return key ? data[key] : data;
                },
                dataValues: { goal_type: 'STRENGTH' }
            } as any;

            vi.spyOn(workoutPreferenceService, 'getPreference').mockResolvedValue([mockPreference]);
            vi.spyOn(aiService, 'generateWorkoutPlans').mockResolvedValue({ workouts: [] });

            await generateFromPreferences(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: { workouts: [] }
            });
        });

        it('should return 404 if no preferences found', async () => {
            vi.spyOn(workoutPreferenceService, 'getPreference').mockResolvedValue([]);

            await generateFromPreferences(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'No preferences found for this user'
            });
        });
    });

    describe('createWorkoutPlan', () => {
        it('should create a new workout plan', async () => {
            const mockPlan = { workouts: [] };
            vi.spyOn(aiService, 'generateWorkoutPlans').mockResolvedValue(mockPlan);
            mockRequest.body = { goal_type: 'STRENGTH' };

            await createWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockPlan
            });
        });

        it('should handle errors when creating workout plan', async () => {
            vi.spyOn(aiService, 'generateWorkoutPlans').mockRejectedValue(new Error('Failed to create'));

            await createWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Failed to create workout plan',
                details: 'Failed to create'
            });
        });
    });

    describe('getWorkoutPlan', () => {
        it('should get workout plan by id', async () => {
            const mockPlan = {
                get: () => ({ id: 1, name: 'Test Plan' }),
                dataValues: { id: 1, name: 'Test Plan' }
            } as any;
            
            vi.spyOn(workoutPlanService, 'getPlanById').mockResolvedValue(mockPlan);
            mockRequest.params = { id: '1' };

            await getWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockPlan
            });
        });
    });

    describe('deleteWorkoutPlan', () => {
        it('should delete workout plan', async () => {
            vi.spyOn(workoutPlanService, 'deletePlan').mockResolvedValue(1);
            mockRequest.params = { id: '1' };

            await deleteWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true });
        });
    });

    describe('getWorkoutPlanExercises', () => {
        it('should get workout plan exercises', async () => {
            const mockExercises = [{
                get: () => ({ id: 1, name: 'Exercise 1' }),
                dataValues: { id: 1, name: 'Exercise 1' }
            }] as any[];

            vi.spyOn(workoutPlanService, 'getPlansAndExercises').mockResolvedValue(mockExercises);

            await getWorkoutPlanExercises(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockExercises
            });
        });
    });

    describe('getAllWorkoutPlans', () => {
        it('should get all workout plans', async () => {
            const mockPlans = [{
                get: () => ({ id: 1, name: 'Plan 1' }),
                dataValues: { id: 1, name: 'Plan 1' }
            }] as any[];

            vi.spyOn(workoutPlanService, 'getAllPlans').mockResolvedValue(mockPlans);

            await getAllWorkoutPlans(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockPlans
            });
        });
    });

    describe('updateActiveWorkoutPlan', () => {
        it('should update active workout plan', async () => {
            vi.spyOn(workoutPlanService, 'switchActivePlan').mockResolvedValue([1]);
            mockRequest.body = { planId: 1 };

            await updateActiveWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'Active workout plan updated successfully'
            });
        });

        it('should return 400 if planId is missing', async () => {
            mockRequest.body = {};

            await updateActiveWorkoutPlan(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Plan ID is required'
            });
        });
    });
});