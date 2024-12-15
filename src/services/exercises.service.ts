import { PlanExercise, WorkoutPlan } from "../models";
import { PlanExerciseType } from "../types/types";

export const createPlanExercise = async (planExercise: Omit<PlanExerciseType, 'plan_exercise_id'>) => {
    return await PlanExercise.create(planExercise);
}

export const getAllUserExercises = async (user_id: number) => {
    return await PlanExercise.findAll({
        include: [{
            model: WorkoutPlan,
            as: 'workoutPlan',
            where: { user_id },
            attributes: []
        }]
    });
}

export const getSinglePlanExercises = async (plan_id: number) => {
    return await PlanExercise.findAll({ where: { plan_id } });
}

export const getPlanExerciseById = async (plan_exercise_id: number) => {
    try {
        const exercise = await PlanExercise.findByPk(plan_exercise_id);
        if (!exercise) {
            throw new Error(`Exercise with id ${plan_exercise_id} not found`);
        }
        return exercise;
    } catch (error) {
        console.error('Error fetching exercise:', error);
        throw error;
    }
}

export const updatePlanExercise = async (plan_exercise_id: number, planExercise: Omit<PlanExerciseType, 'plan_exercise_id'>) => {
    return await PlanExercise.update(planExercise, { where: { plan_exercise_id } });
}

export const deletePlanExercise = async (plan_exercise_id: number) => {
    return await PlanExercise.destroy({ where: { plan_exercise_id } });
}

export async function createPlanExerciseBulk(planExercises: Array<Omit<PlanExerciseType, 'plan_exercise_id'>>) {
    return await PlanExercise.bulkCreate(planExercises);
}

