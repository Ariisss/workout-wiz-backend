import { PlanExercise, WorkoutPlan } from "../models";
import { WorkoutPlanType, PlanIdType } from "../types/types";

export const createPlan = async (workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
    return await WorkoutPlan.create(workoutPlan);
}

export const getPlanById = async (plan_id: number) => {
    return await WorkoutPlan.findByPk(plan_id);
}

// export const updatePlan = async (plan_id: number, workoutPlan: Omit<WorkoutPlanType, 'plan_id'>) => {
//     return await WorkoutPlan.update(workoutPlan, { where: { plan_id } });
// }

export const deletePlan = async (plan_id: number) => {
    await PlanExercise.destroy({ where: { plan_id } });
    return await WorkoutPlan.destroy({ where: { plan_id } });
}

export const getPlanId = async (user_id: number): Promise<PlanIdType | null> => {
    return await WorkoutPlan.findOne({ where: { user_id } }).then((plan) => plan?.get());
}

export const getAllPlans = async (user_id: number) => {
    return await WorkoutPlan.findAll({ where: { user_id } });
}
