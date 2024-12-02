import { Preferences } from "../models";
import { WorkoutPreferenceType } from "../types/types";

export const createPreference = async (workoutPreference: Omit<WorkoutPreferenceType, 'preference_id'>) => {
    return await Preferences.create(workoutPreference);
}

export const getPreference = async (userId: number) => {
    return await Preferences.findAll({ where: { user_id: userId } });
}

export const updatePreferences = async (workoutPreference: WorkoutPreferenceType, userId: number) => {
    return await Preferences.update(workoutPreference, { where: { user_id: userId } });
}

export const removePreferences = async (userId: number) => {
    return await Preferences.destroy({ where: { user_id: userId } });
}


