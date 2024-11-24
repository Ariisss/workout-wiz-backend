import { Preferences } from "../models";
import { WorkoutPreferenceType } from "../types/types";

export const createWorkoutPreference = async (workoutPreference: Omit<WorkoutPreferenceType, 'preference_id'>) => {
    return await Preferences.create(workoutPreference);
}

