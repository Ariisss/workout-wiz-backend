import { Preferences } from "../models";
import { WorkoutPreferenceType } from "../types/types";

export const createWorkoutPreference = async (workoutPreference: Omit<WorkoutPreferenceType, 'preference_id'>) => {
    return await Preferences.create(workoutPreference);
}

export const getWorkoutPreference = async (userId: number) => {
    return await Preferences.findAll({ where: { user_id: userId } });
}

export const updateWorkoutPreference = async (workoutPreference: WorkoutPreferenceType) => {
    return await Preferences.update(workoutPreference, { where: { preference_id: workoutPreference.preference_id } });
}

export const deleteWorkoutPreference = async (preferenceId: number) => {
    return await Preferences.destroy({ where: { preference_id: preferenceId } });
}


