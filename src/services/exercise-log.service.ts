import { ExerciseLog } from "../models";
import { ExerciseLogType } from "../types/types";
import { getPlanExerciseById } from "./exercises.service";

export const createLog = async (exerciseLog: Omit<ExerciseLogType, 'log_id'>) => {
    return await ExerciseLog.create({ ...exerciseLog});
}

export const getLogs = async (user_id: number) => {
    return await ExerciseLog.findAll({ where: { user_id } });
}

export const getLogById = async (log_id: number) => {
    return await ExerciseLog.findByPk(log_id);
}

export const updateLog = async (log_id: number, exerciseLog: Omit<ExerciseLogType, 'log_id'>) => {
    return await ExerciseLog.update(exerciseLog, { where: { log_id } });
}

export const deleteLog = async (log_id: number) => {
    return await ExerciseLog.destroy({ where: { log_id } });
}

export const computeCaloriesBurned = async (
    duration_mins: number, 
    plan_exercise_id: number,
    weight_kg: number
) => {
    const exercise = await getPlanExerciseById(plan_exercise_id);
    if (!exercise) {
        throw new Error('Exercise not found');
    }

    const met = exercise.get('met_value') as number;
    
    const calories = (met * weight_kg * 3.5 * duration_mins) / 200;
    
    return calories;
}
