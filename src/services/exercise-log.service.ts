import { ExerciseLog } from "../models";
import { ExerciseLogType } from "../types/types";

export const createExerciseLog = async (exerciseLog: Omit<ExerciseLogType, 'exercise_log_id'>) => {
    return await ExerciseLog.create(exerciseLog);
}

export const getExerciseLogs = async (user_id: number) => {
    return await ExerciseLog.findAll({ where: { user_id } });
}

export const getExerciseLogById = async (log_id: number) => {
    return await ExerciseLog.findByPk(log_id);
}

export const updateExerciseLog = async (log_id: number, exerciseLog: Omit<ExerciseLogType, 'log_id'>) => {
    return await ExerciseLog.update(exerciseLog, { where: { log_id } });
}

export const deleteExerciseLog = async (log_id: number) => {
    return await ExerciseLog.destroy({ where: { log_id } });
}
