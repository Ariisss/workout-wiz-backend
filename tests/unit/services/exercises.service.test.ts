import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    createPlanExercise,
    getAllUserExercises,
    getSinglePlanExercises,
    getPlanExerciseById,
    updatePlanExercise,
    deletePlanExercise,
    createPlanExerciseBulk
} from '../../../src/services/exercises.service';
import { PlanExercise, WorkoutPlan } from '../../../src/models';
import { PlanExerciseType } from '../../../src/types/types';

// mock models
vi.mock('../../../src/models', () => ({
    PlanExercise: {
        create: vi.fn(),
        findAll: vi.fn(),
        findByPk: vi.fn(),
        update: vi.fn(),
        destroy: vi.fn(),
        bulkCreate: vi.fn()
    },
    WorkoutPlan: {}
}));

describe('Exercises Service', () => {
    const mockUserId = 1;
    const mockPlanId = 1;
    const mockPlanExerciseId = 1;

    const mockPlanExercise: Omit<PlanExerciseType, 'plan_exercise_id'> = {
        plan_id: mockPlanId,
        exercise_name: 'Push-ups',
        description: 'Standard push-up exercise',
        sets: 3,
        reps: 10,
        duration_mins: 15,
        workout_day: 'Monday',
        met_value: 6.0
    };

    const mockPlanExerciseWithId: PlanExerciseType = {
        plan_exercise_id: mockPlanExerciseId,
        ...mockPlanExercise
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPlanExercise', () => {
        it('should create a new plan exercise', async () => {
            const mockCreatedExercise = { 
                get: () => mockPlanExerciseWithId 
            };

            vi.spyOn(PlanExercise, 'create').mockResolvedValue(mockCreatedExercise as any);

            const result = await createPlanExercise(mockPlanExercise);

            expect(PlanExercise.create).toHaveBeenCalledWith(mockPlanExercise);
            expect(result).toBe(mockCreatedExercise);
        });
    });

    describe('getAllUserExercises', () => {
        it('should retrieve all exercises for a user', async () => {
            const mockExercises = [{ 
                get: () => mockPlanExerciseWithId 
            }];

            vi.spyOn(PlanExercise, 'findAll').mockResolvedValue(mockExercises as any);

            const result = await getAllUserExercises(mockUserId);

            expect(PlanExercise.findAll).toHaveBeenCalledWith({
                include: [{
                    model: WorkoutPlan,
                    as: 'workoutPlan',
                    where: { user_id: mockUserId },
                    attributes: []
                }]
            });
            expect(result).toBe(mockExercises);
        });
    });

    describe('getSinglePlanExercises', () => {
        it('should retrieve exercises for a specific plan', async () => {
            const mockExercises = [{ 
                get: () => mockPlanExerciseWithId 
            }];

            vi.spyOn(PlanExercise, 'findAll').mockResolvedValue(mockExercises as any);

            const result = await getSinglePlanExercises(mockPlanId);

            expect(PlanExercise.findAll).toHaveBeenCalledWith({ 
                where: { plan_id: mockPlanId } 
            });
            expect(result).toBe(mockExercises);
        });
    });

    describe('getPlanExerciseById', () => {
        it('should retrieve a specific exercise by ID', async () => {
            const mockExercise = { 
                get: () => mockPlanExerciseWithId 
            };

            vi.spyOn(PlanExercise, 'findByPk').mockResolvedValue(mockExercise as any);

            const result = await getPlanExerciseById(mockPlanExerciseId);

            expect(PlanExercise.findByPk).toHaveBeenCalledWith(mockPlanExerciseId);
            expect(result).toBe(mockExercise);
        });

        it('should throw error if exercise not found', async () => {
            vi.spyOn(PlanExercise, 'findByPk').mockResolvedValue(null as any);

            await expect(getPlanExerciseById(mockPlanExerciseId))
                .rejects.toThrow(`Exercise with id ${mockPlanExerciseId} not found`);
        });
    });

    describe('updatePlanExercise', () => {
        it('should update an existing exercise', async () => {
            const updatedData = { ...mockPlanExercise, sets: 4 };
            const mockUpdateResult = [1]; 


            vi.spyOn(PlanExercise, 'update').mockResolvedValue(mockUpdateResult as any);

            const result = await updatePlanExercise(mockPlanExerciseId, updatedData);

            expect(PlanExercise.update).toHaveBeenCalledWith(
                updatedData, 
                { where: { plan_exercise_id: mockPlanExerciseId } }
            );
            expect(result).toBe(mockUpdateResult);
        });
    });

    describe('deletePlanExercise', () => {
        it('should delete an exercise', async () => {
            const mockDeleteResult = 1;

            vi.spyOn(PlanExercise, 'destroy').mockResolvedValue(mockDeleteResult as any);

            const result = await deletePlanExercise(mockPlanExerciseId);

            expect(PlanExercise.destroy).toHaveBeenCalledWith({ 
                where: { plan_exercise_id: mockPlanExerciseId } 
            });
            expect(result).toBe(mockDeleteResult);
        });
    });

    describe('createPlanExerciseBulk', () => {
        it('should create multiple exercises in bulk', async () => {
            const mockExercises = [mockPlanExercise, mockPlanExercise];
            const mockCreatedExercises = mockExercises.map(exercise => ({
                get: () => ({ ...exercise, plan_exercise_id: Math.random() })
            }));

            vi.spyOn(PlanExercise, 'bulkCreate').mockResolvedValue(mockCreatedExercises as any);

            const result = await createPlanExerciseBulk(mockExercises);

            expect(PlanExercise.bulkCreate).toHaveBeenCalledWith(mockExercises);
            expect(result).toBe(mockCreatedExercises);
        });
    });
});