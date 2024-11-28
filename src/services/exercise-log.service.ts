import { ExerciseLog } from "../models";
import { ExerciseLogType } from "../types/types";

export const createExerciseLog = async (exerciseLog: Omit<ExerciseLogType, 'exercise_log_id'>) => {
    return await ExerciseLog.create(exerciseLog);
}


