import { ExerciseLog } from "../models";
import { ExerciseLogType, PlanExerciseType } from "../types/types";
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

    const ex = exercise.get() as PlanExerciseType;

    if(ex.sets > 1 && ex.sets > 1){

        const timePerRep = 0.0667;
        
        const totalTime = ex.sets * ex.reps * timePerRep;
        
        const restTimePerSet = 1.5; 
        const totalRestTime = (ex.sets - 1) * restTimePerSet;
        
        const totalDuration = totalTime + totalRestTime;
        
        const adjustedMet = ex.met_value * 1.5;
        
        return Math.round((adjustedMet * weight_kg * 3.5 * totalDuration) / 200);

    }
    
    return Math.round((ex.met_value * weight_kg * 3.5 * Math.max(duration_mins, 1)) / 200);
}
