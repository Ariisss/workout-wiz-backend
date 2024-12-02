import { WorkoutPlan } from "../models";
import { WorkoutPlanType } from "../types/types";

export const createPlan = async (workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
    return await WorkoutPlan.create(workoutPlan);
}

export const getPlans = async (user_id: number) => {
    return await WorkoutPlan.findAll({ where: { user_id } });
}

export const getPlanById = async (plan_id: number) => {
    return await WorkoutPlan.findByPk(plan_id);
}

// export const updatePlan = async (plan_id: number, workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
//     return await WorkoutPlan.update(workoutPlan, { where: { plan_id } });
// }

export const deletePlan = async (plan_id: number) => {
    return await WorkoutPlan.destroy({ where: { plan_id } });
}
