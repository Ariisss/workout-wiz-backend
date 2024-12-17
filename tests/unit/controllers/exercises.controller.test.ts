import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getExercises, deleteExercise, getExerciseById } from '../../../src/controllers/exercises.controller';
import * as exercisesService from '../../../src/services/exercises.service';

interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}

describe('Exercises Controller', () => {
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

    describe('getExercises', () => {
        it('should successfully return exercises', async () => {
            const mockExercises = [{
                plan_exercise_id: 1,
                exercise_name: 'Push-ups',
                duration_mins: 30,
                sets: 3,
                reps: 10,
                plan_id: 1
            }];

            vi.spyOn(exercisesService, 'getAllUserExercises').mockResolvedValue(mockExercises.map(exercise => ({
                get: () => exercise,
                toJSON: () => exercise,
                dataValues: exercise,
                ...exercise
            } as any)));

            await getExercises(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockExercises.map(exercise => ({
                    ...exercise,
                    dataValues: exercise,
                    get: expect.any(Function),
                    toJSON: expect.any(Function)
                }))
            });
        });

        it('should handle errors when fetching exercises', async () => {
            vi.spyOn(exercisesService, 'getAllUserExercises').mockRejectedValue(new Error('Database error'));

            await getExercises(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch exercises' });
        });
    });

    describe('getExerciseById', () => {
        it('should successfully return a specific exercise', async () => {
            const mockExercise = {
                plan_exercise_id: 1,
                exercise_name: 'Push-ups',
                duration_mins: 30,
                sets: 3,
                reps: 10,
                plan_id: 1
            };

            vi.spyOn(exercisesService, 'getPlanExerciseById').mockResolvedValue({
                get: () => mockExercise,
                toJSON: () => mockExercise,
                dataValues: mockExercise,
                ...mockExercise
            } as any);

            mockRequest.params = { id: '1' };

            await getExerciseById(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                exercise: {
                    ...mockExercise,
                    dataValues: mockExercise,
                    get: expect.any(Function),
                    toJSON: expect.any(Function)
                }
            });
        });

        it('should handle errors when fetching exercise by id', async () => {
            vi.spyOn(exercisesService, 'getPlanExerciseById').mockRejectedValue(new Error('Database error'));
            mockRequest.params = { id: '1' };

            await getExerciseById(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to fetch exercise' });
        });
    });

    describe('deleteExercise', () => {
        it('should successfully delete an exercise', async () => {
            vi.spyOn(exercisesService, 'deletePlanExercise').mockResolvedValue(1);
            mockRequest.params = { id: '1' };

            await deleteExercise(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ success: true });
        });

        it('should handle errors when deleting exercise', async () => {
            vi.spyOn(exercisesService, 'deletePlanExercise').mockRejectedValue(new Error('Database error'));
            mockRequest.params = { id: '1' };

            await deleteExercise(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to delete exercise' });
        });
    });
});