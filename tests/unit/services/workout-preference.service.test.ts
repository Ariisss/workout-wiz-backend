import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    createPreference,
    getPreference,
    updatePreferences,
    removePreferences
} from '../../../src/services/workout-preference.service';
import { Preferences } from '../../../src/models';
import { WorkoutPreferenceType } from '../../../src/types/types';
import { GOAL_TYPES, INTENSITY_LEVELS } from '../../../src/types/workout-types';

// mock preferences model
vi.mock('../../../src/models', () => ({
    Preferences: {
        create: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(),
        destroy: vi.fn()
    }
}));

describe('Workout Preference Service', () => {
    const mockUserId = 1;
    const mockPreferenceId = 1;

    const mockWorkoutPreference: Omit<WorkoutPreferenceType, 'preference_id'> = {
        user_id: mockUserId,
        goal_type: GOAL_TYPES.WEIGHT_LOSS,
        with_gym: true,
        workout_days: '1,2,3',
        intensity: INTENSITY_LEVELS.INTERMEDIATE
    };

    const mockWorkoutPreferenceWithId: WorkoutPreferenceType = {
        preference_id: mockPreferenceId,
        ...mockWorkoutPreference
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPreference', () => {
        it('should create a new workout preference', async () => {
            const mockCreatedPreference = {
                get: () => mockWorkoutPreferenceWithId
            };

            vi.spyOn(Preferences, 'create').mockResolvedValue(mockCreatedPreference as any);

            const result = await createPreference(mockWorkoutPreference);

            expect(Preferences.create).toHaveBeenCalledWith(mockWorkoutPreference);
            expect(result).toBe(mockCreatedPreference);
        });
    });

    describe('getPreference', () => {
        it('should retrieve preferences for a user', async () => {
            const mockPreferences = [{
                get: () => mockWorkoutPreferenceWithId
            }];

            vi.spyOn(Preferences, 'findAll').mockResolvedValue(mockPreferences as any);

            const result = await getPreference(mockUserId);

            expect(Preferences.findAll).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
            expect(result).toBe(mockPreferences);
        });

        it('should return empty array if no preferences found', async () => {
            vi.spyOn(Preferences, 'findAll').mockResolvedValue([]);

            const result = await getPreference(mockUserId);

            expect(result).toEqual([]);
        });
    });

    describe('updatePreferences', () => {
        it('should update preferences for a user', async () => {
            const updateResult = [1];
            vi.spyOn(Preferences, 'update').mockResolvedValue(updateResult as any);

            const result = await updatePreferences(mockWorkoutPreferenceWithId, mockUserId);

            expect(Preferences.update).toHaveBeenCalledWith(
                mockWorkoutPreferenceWithId,
                { where: { user_id: mockUserId } }
            );
            expect(result).toBe(updateResult);
        });

        it('should return [0] if no preferences were updated', async () => {
            vi.spyOn(Preferences, 'update').mockResolvedValue([0] as any);

            const result = await updatePreferences(mockWorkoutPreferenceWithId, mockUserId);

            expect(result).toEqual([0]);
        });
    });

    describe('removePreferences', () => {
        it('should remove preferences for a user', async () => {
            const deleteCount = 1;
            vi.spyOn(Preferences, 'destroy').mockResolvedValue(deleteCount as any);

            const result = await removePreferences(mockUserId);

            expect(Preferences.destroy).toHaveBeenCalledWith({ where: { user_id: mockUserId } });
            expect(result).toBe(deleteCount);
        });

        it('should return 0 if no preferences were removed', async () => {
            vi.spyOn(Preferences, 'destroy').mockResolvedValue(0 as any);

            const result = await removePreferences(mockUserId);

            expect(result).toBe(0);
        });
    });
});