import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    createPlan,
    getPlanById,
    deletePlan,
    getPlanId,
    getAllPlanIds,
    getAllPlans,
    getPlansAndExercises,
    switchActivePlan
} from '../../../src/services/workout-plan.service';
import { WorkoutPlan, PlanExercise } from '../../../src/models';
import { WorkoutPlanType, PlanIdType } from '../../../src/types/types';
import { GOAL_TYPES, INTENSITY_LEVELS } from '../../../src/types/workout-types';

// mock models
vi.mock('../../../src/models', () => ({
    WorkoutPlan: {
        create: vi.fn(),
        findByPk: vi.fn(),
        destroy: vi.fn(),
        findOne: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn()
    },
    PlanExercise: {
        destroy: vi.fn()
    }
}));

describe('Workout Plan Service', () => {
    const mockUserId = 1;
    const mockPlanId = 1;

    const mockWorkoutPlan: Omit<WorkoutPlanType, 'plan_id'> = {
        user_id: mockUserId,
        plan_name: 'Test Workout Plan',
        description: 'A test workout plan',
        goal: [GOAL_TYPES.WEIGHT_LOSS],
        duration_weeks: 4,
        workout_days: '1,2,3,4',
        intensity: INTENSITY_LEVELS.INTERMEDIATE
    };

    const mockWorkoutPlanWithId: WorkoutPlanType = {
        plan_id: mockPlanId,
        ...mockWorkoutPlan
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPlan', () => {
        it('should create a new workout plan', async () => {
            const mockCreatedPlan = { 
                get: () => mockWorkoutPlanWithId 
            };

            vi.spyOn(WorkoutPlan, 'create').mockResolvedValue(mockCreatedPlan as any);

            const result = await createPlan(mockWorkoutPlan);

            expect(WorkoutPlan.create).toHaveBeenCalledWith(mockWorkoutPlan);
            expect(result).toBe(mockCreatedPlan);
        });
    });

    describe('getPlanById', () => {
        it('should retrieve a plan by ID', async () => {
            const mockPlan = { 
                get: () => mockWorkoutPlanWithId 
            };

            vi.spyOn(WorkoutPlan, 'findByPk').mockResolvedValue(mockPlan as any);

            const result = await getPlanById(mockPlanId);

            expect(WorkoutPlan.findByPk).toHaveBeenCalledWith(mockPlanId);
            expect(result).toBe(mockPlan);
        });
    });

    describe('deletePlan', () => {
        it('should delete a plan and its associated exercises', async () => {
            vi.spyOn(PlanExercise, 'destroy').mockResolvedValue(1 as any);
            vi.spyOn(WorkoutPlan, 'destroy').mockResolvedValue(1 as any);

            const result = await deletePlan(mockPlanId);

            expect(PlanExercise.destroy).toHaveBeenCalledWith({ where: { plan_id: mockPlanId } });
            expect(WorkoutPlan.destroy).toHaveBeenCalledWith({ where: { plan_id: mockPlanId } });
            expect(result).toBe(1);
        });
    });

    describe('getPlanId', () => {
        it('should retrieve a plan ID for a user', async () => {
            vi.spyOn(WorkoutPlan, 'findOne').mockResolvedValue({
                get: () => mockPlanId
            } as any);

            const result = await getPlanId(mockUserId);

            expect(WorkoutPlan.findOne).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
            expect(result).toBe(mockPlanId);
        });

        it('should return null if no plan found', async () => {
            vi.spyOn(WorkoutPlan, 'findOne').mockResolvedValue({
                get: () => null
            } as any);

            const result = await getPlanId(mockUserId);

            expect(result).toBe(null);
        });
    });

    describe('getAllPlanIds', () => {
        it('should retrieve all plan IDs for a user', async () => {
            const mockPlanIds = [1, 2, 3];
            const mockPlans = mockPlanIds.map(id => ({
                get: () => id
            }));

            vi.spyOn(WorkoutPlan, 'findAll').mockResolvedValue(mockPlans as any);

            const result = await getAllPlanIds(mockUserId);

            expect(WorkoutPlan.findAll).toHaveBeenCalledWith({
                where: { user_id: mockUserId },
                attributes: ['plan_id']
            });
            expect(result).toEqual(mockPlanIds);
        });
    });

    describe('getAllPlans', () => {
        it('should retrieve all plans for a user', async () => {
            const mockPlans = [{ 
                get: () => mockWorkoutPlanWithId 
            }];

            vi.spyOn(WorkoutPlan, 'findAll').mockResolvedValue(mockPlans as any);

            const result = await getAllPlans(mockUserId);

            expect(WorkoutPlan.findAll).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
            expect(result).toBe(mockPlans);
        });
    });

    describe('getPlansAndExercises', () => {
        it('should retrieve plans with their exercises', async () => {
            const mockPlansWithExercises = [{ 
                get: () => ({
                    ...mockWorkoutPlanWithId,
                    planExercises: [{ exercise_name: 'Push-ups' }]
                })
            }];

            vi.spyOn(WorkoutPlan, 'findAll').mockResolvedValue(mockPlansWithExercises as any);

            const result = await getPlansAndExercises(mockUserId);

            expect(WorkoutPlan.findAll).toHaveBeenCalledWith({
                where: { user_id: mockUserId },
                include: [{ model: PlanExercise, as: 'planExercises' }]
            });
            expect(result).toBe(mockPlansWithExercises);
        });
    });

    describe('switchActivePlan', () => {
        it('should switch active plan for a user', async () => {
            vi.spyOn(WorkoutPlan, 'update')
                .mockResolvedValueOnce([1])
                .mockResolvedValueOnce([1]);

            const result = await switchActivePlan(mockUserId, mockPlanId);

            expect(WorkoutPlan.update).toHaveBeenCalledWith(
                { is_active: false }, 
                { where: { is_active: true, user_id: mockUserId } }
            );
            expect(WorkoutPlan.update).toHaveBeenCalledWith(
                { is_active: true }, 
                { where: { plan_id: mockPlanId } }
            );
            expect(result).toBeDefined();
        });
    });
});