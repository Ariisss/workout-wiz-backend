import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { logExercise, getExerciseLogs, getExerciseLogById, deleteExerciseLog } from '../../../src/controllers/exercise-log.controller';
import * as exerciseLogService from '../../../src/services/exercise-log.service';
import * as userService from '../../../src/services/user.service';
import * as exercisesService from '../../../src/services/exercises.service';
import { UserType, PlanExerciseType, ExerciseLogType } from '../../../src/types/types';

vi.mock('../../../src/services/exercise-log.service');
vi.mock('../../../src/services/user.service');
vi.mock('../../../src/services/exercises.service');

// Extend the Express Request type
interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

describe('Exercise Log Controller', () => {
    let mockRequest: Partial<CustomRequest>;
    let mockResponse: Partial<Response>;
    let mockJson: ReturnType<typeof vi.fn>;
    let mockStatus: ReturnType<typeof vi.fn>;

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
    });

    describe('logExercise', () => {
        it('should successfully log an exercise', async () => {
            const mockUser: UserType = {
                user_id: 1,
                username: 'testuser',
                email: 'test@test.com',
                password: 'hashedpass',
                sex: true,
                dob: '1990-01-01',
                weight: 70,
                height: 170,
                weeklyStreak: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockPlanExercise: PlanExerciseType = {
                plan_exercise_id: 1,
                plan_id: 1,
                exercise_name: 'Push-ups',
                description: 'Basic push-ups',
                duration_mins: 10,
                sets: 3,
                reps: 10,
                workout_day: 'Monday',
                met_value: 3.8
            };

            const mockExerciseLog: ExerciseLogType = {
                log_id: 1,
                exercise_name: 'Push-ups',
                user_id: 1,
                plan_exercise_id: 1,
                date: new Date(),
                duration_mins: 30,
                calories_burned: 150
            };

            vi.spyOn(userService, 'getUser').mockResolvedValue({
                get: () => mockUser,
                toJSON: () => mockUser,
                dataValues: mockUser,
                ...mockUser
            } as any);
            vi.spyOn(exercisesService, 'getPlanExerciseById').mockResolvedValue({
                get: () => mockPlanExercise,
                toJSON: () => mockPlanExercise,
                dataValues: mockPlanExercise,
                ...mockPlanExercise
            } as any);
            vi.spyOn(exerciseLogService, 'computeCaloriesBurned').mockResolvedValue(150);
            vi.spyOn(exerciseLogService, 'createLog').mockResolvedValue({
                get: () => mockExerciseLog,
                toJSON: () => mockExerciseLog,
                dataValues: mockExerciseLog,
                ...mockExerciseLog
            } as any);

            mockRequest.body = { plan_exercise_id: 1 };

            await logExercise(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.any(Object)
            }));
        });

        it('should return 404 if user not found', async () => {
            vi.spyOn(userService, 'getUser').mockResolvedValue(null);

            await logExercise(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('getExerciseLogs', () => {
        it('should successfully return exercise logs', async () => {
            const mockLogs: ExerciseLogType[] = [{
                log_id: 1,
                exercise_name: 'Push-ups',
                user_id: 1,
                plan_exercise_id: 1,
                date: new Date(),
                duration_mins: 30,
                calories_burned: 150
            }];
            vi.spyOn(exerciseLogService, 'getLogs').mockResolvedValue(mockLogs.map(log => ({
                get: () => log,
                toJSON: () => log,
                dataValues: log,
                ...log
            } as any)));

            await getExerciseLogs(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockLogs.map(log => ({
                    ...log,
                    dataValues: log,
                    get: expect.any(Function),
                    toJSON: expect.any(Function)
                }))
            });
        });

        it('should handle errors when fetching logs', async () => {
            vi.spyOn(exerciseLogService, 'getLogs').mockRejectedValue(new Error('Database error'));

            await getExerciseLogs(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch exercise logs' });
        });
    });

    describe('getExerciseLogById', () => {
        it('should successfully return a specific exercise log', async () => {
            const mockLog: ExerciseLogType = {
                log_id: 1,
                exercise_name: 'Push-ups',
                user_id: 1,
                plan_exercise_id: 1,
                date: new Date(),
                duration_mins: 30,
                calories_burned: 150
            };
            vi.spyOn(exerciseLogService, 'getLogById').mockResolvedValue({
                get: () => mockLog,
                toJSON: () => mockLog,
                dataValues: mockLog,
                ...mockLog
            } as any);
            mockRequest.params = { log_id: '1' };

            await getExerciseLogById(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: {
                    ...mockLog,
                    dataValues: mockLog,
                    get: expect.any(Function),
                    toJSON: expect.any(Function)
                }
            });
        });

        it('should handle errors when fetching log by id', async () => {
            vi.spyOn(exerciseLogService, 'getLogById').mockRejectedValue(new Error('Database error'));
            mockRequest.params = { log_id: '1' };

            await getExerciseLogById(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch exercise log by ID' });
        });
    });

    describe('deleteExerciseLog', () => {
        it('should successfully delete an exercise log', async () => {
            vi.spyOn(exerciseLogService, 'deleteLog').mockResolvedValue(1);
            mockRequest.params = { log_id: '1' };

            await deleteExerciseLog(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true });
        });

        it('should handle errors when deleting log', async () => {
            vi.spyOn(exerciseLogService, 'deleteLog').mockRejectedValue(new Error('Database error'));
            mockRequest.params = { log_id: '1' };

            await deleteExerciseLog(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to delete exercise log' });
        });
    });
});