import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    createLog, 
    getLogs, 
    getLogById, 
    updateLog, 
    deleteLog, 
    computeCaloriesBurned 
} from '../../../src/services/exercise-log.service';
import { ExerciseLog } from '../../../src/models';
import * as exercisesService from '../../../src/services/exercises.service';
import { ExerciseLogType, PlanExerciseType } from '../../../src/types/types';

// Mock the models and services
vi.mock('../../../src/models', () => ({
    ExerciseLog: {
        create: vi.fn(),
        findAll: vi.fn(),
        findByPk: vi.fn(),
        update: vi.fn(),
        destroy: vi.fn()
    }
}));

vi.mock('../../../src/services/exercises.service');

describe('Exercise Log Service', () => {
    const mockUserId = 1;
    const mockLogId = 1;

    const mockExerciseLog: Omit<ExerciseLogType, 'log_id'> = {
        user_id: mockUserId,
        plan_exercise_id: 1,
        exercise_name: 'Push-ups',
        date: new Date(),
        duration_mins: 30,
        calories_burned: 100
    };

    const mockPlanExercise: PlanExerciseType = {
        plan_exercise_id: 1,
        plan_id: 1,
        exercise_name: 'Push-ups',
        description: 'Standard push-up exercise',
        sets: 3,
        reps: 10,
        duration_mins: 15,
        workout_day: 'Monday',
        met_value: 6.0
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createLog', () => {
        it('should create a new exercise log', async () => {
            const mockCreatedLog = { 
                get: () => ({ ...mockExerciseLog, log_id: mockLogId }) 
            };

            vi.spyOn(ExerciseLog, 'create').mockResolvedValue(mockCreatedLog as any);

            const result = await createLog(mockExerciseLog);

            expect(ExerciseLog.create).toHaveBeenCalledWith(mockExerciseLog);
            expect(result).toBe(mockCreatedLog);
        });
    });

    describe('getLogs', () => {
        it('should retrieve logs for a user', async () => {
            const mockLogs = [
                { get: () => ({ ...mockExerciseLog, log_id: mockLogId }) }
            ];

            vi.spyOn(ExerciseLog, 'findAll').mockResolvedValue(mockLogs as any);

            const result = await getLogs(mockUserId);

            expect(ExerciseLog.findAll).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
            expect(result).toBe(mockLogs);
        });
    });

    describe('getLogById', () => {
        it('should retrieve a log by its ID', async () => {
            const mockLog = { 
                get: () => ({ ...mockExerciseLog, log_id: mockLogId }) 
            };

            vi.spyOn(ExerciseLog, 'findByPk').mockResolvedValue(mockLog as any);

            const result = await getLogById(mockLogId);

            expect(ExerciseLog.findByPk).toHaveBeenCalledWith(mockLogId);
            expect(result).toBe(mockLog);
        });
    });

    describe('updateLog', () => {
        it('should update an existing log', async () => {
            const updatedData = { ...mockExerciseLog, reps: 12 };
            const mockUpdateResult = [1]; 

            vi.spyOn(ExerciseLog, 'update').mockResolvedValue(mockUpdateResult as any);

            const result = await updateLog(mockLogId, updatedData);

            expect(ExerciseLog.update).toHaveBeenCalledWith(updatedData, { where: { log_id: mockLogId } });
            expect(result).toBe(mockUpdateResult);
        });
    });

    describe('deleteLog', () => {
        it('should delete a log', async () => {
            const mockDeleteResult = 1; 

            vi.spyOn(ExerciseLog, 'destroy').mockResolvedValue(mockDeleteResult as any);

            const result = await deleteLog(mockLogId);

            expect(ExerciseLog.destroy).toHaveBeenCalledWith({ where: { log_id: mockLogId } });
            expect(result).toBe(mockDeleteResult);
        });
    });

    describe('computeCaloriesBurned', () => {
        it('should compute calories burned for a single exercise', async () => {
            const mockExercise = { 
                get: () => ({ ...mockPlanExercise, sets: 1, reps: 1 }) 
            };

            vi.spyOn(exercisesService, 'getPlanExerciseById').mockResolvedValue(mockExercise as any);

            const result = await computeCaloriesBurned(30, mockPlanExercise.plan_exercise_id, 70);

            expect(exercisesService.getPlanExerciseById).toHaveBeenCalledWith(mockPlanExercise.plan_exercise_id);
            expect(result).toBeGreaterThan(0);
        });

        it('should compute calories burned for multi-set exercise', async () => {
            const mockExercise = { 
                get: () => ({ ...mockPlanExercise, sets: 3, reps: 10 }) 
            };

            vi.spyOn(exercisesService, 'getPlanExerciseById').mockResolvedValue(mockExercise as any);

            const result = await computeCaloriesBurned(30, mockPlanExercise.plan_exercise_id, 70);

            expect(exercisesService.getPlanExerciseById).toHaveBeenCalledWith(mockPlanExercise.plan_exercise_id);
            expect(result).toBeGreaterThan(0);
        });

        it('should throw error if exercise not found', async () => {
            vi.spyOn(exercisesService, 'getPlanExerciseById').mockResolvedValue(null as any);

            await expect(computeCaloriesBurned(30, mockPlanExercise.plan_exercise_id, 70))
                .rejects.toThrow('Exercise not found');
        });
    });
});