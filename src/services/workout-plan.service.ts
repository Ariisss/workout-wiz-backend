import { WorkoutPlan } from "../models";
import { WorkoutPlanType } from "../types/types";

export const createWorkoutPlan = async (workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
    return await WorkoutPlan.create(workoutPlan);
}

export const getWorkoutPlans = async (user_id: number) => {
    return await WorkoutPlan.findAll({ where: { user_id } });
}

export const getWorkoutPlanById = async (plan_id: number) => {
    return await WorkoutPlan.findByPk(plan_id);
}

export const updateWorkoutPlan = async (plan_id: number, workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
    return await WorkoutPlan.update(workoutPlan, { where: { plan_id } });
}

export const deleteWorkoutPlan = async (plan_id: number) => {
    return await WorkoutPlan.destroy({ where: { plan_id } });
}
