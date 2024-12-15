import { Op } from "sequelize";
import { ExerciseLog, User, WorkoutPlan, PlanExercise } from "../models";
import { UserType, WeeklyProgress } from "../types/types";
import { comparePasswords, hashPassword } from "../utils/password.utils";
import cron from 'node-cron'

export const getUser = async (userId: number) => {
    const user = await User.findByPk(userId, {
        attributes: {
            exclude: ['password']
        }
    });
    return user;
}


export const update = async (userId: number, updatedFields: Partial<UserType>) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return await user.update(updatedFields);
}


export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("Invalid credentials.");
    }

    const isOldPasswordValid = await comparePasswords(oldPassword, user.get().password);
    if (!isOldPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const hashedPassword = await hashPassword(newPassword);
    return await user.update({ password: hashedPassword });
}


export const deleteUser = async (userId: number) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    try {
        await user.destroy();
        return true
    } catch (error) {
        return false
    }

}

function getDaysOfWeek(): string[] {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
}

// Utility function to calculate start and end of the current week
function getStartAndEndOfWeek(): { startOfWeek: Date; endOfWeek: Date } {
    const today = new Date();

    // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Calculate days to subtract to get Monday (if today is Sunday, shift back by 6 days)
    const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;

    // Start of the week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Set time to midnight

    // End of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

    return { startOfWeek, endOfWeek };
}

// Schedule the cron job to run every Sunday at 23:59
cron.schedule('59 23 * * SUN', async (): Promise<void> => {
    console.log('Running weekly streak update...');

    try {
        const users = await User.findAll();
        const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
        const daysOfWeek = getDaysOfWeek();

        for (const user of users) {
            const userId = user.getDataValue('user_id');

            // Fetch assigned exercises for the current week
            const assignedExercises = await PlanExercise.findAll({
                attributes: ['plan_exercise_id'],
                include: [
                    {
                        model: WorkoutPlan,
                        where: {
                            user_id: userId,
                            is_active: true,
                        },
                    },
                ],
                where: {
                    workout_day: {
                        [Op.in]: daysOfWeek,
                    },
                    createdAt: {
                        [Op.between]: [startOfWeek, endOfWeek],
                    },
                },
            });

            const currentWeekAssignedExercises = assignedExercises.filter((exercise) => {
                const exerciseDate = exercise.getDataValue('createdAt');
                return exerciseDate >= startOfWeek && exerciseDate <= endOfWeek;
            });

            const completedExercises = await ExerciseLog.findAll({
                attributes: ['plan_exercise_id'],
                where: {
                    user_id: userId,
                    date: {
                        [Op.between]: [startOfWeek, endOfWeek],
                    },
                },
            });

            const allCompleted = currentWeekAssignedExercises.every((exercise) => {
                const exerciseId = exercise.getDataValue('plan_exercise_id');
                return completedExercises.some((log) => log.getDataValue('plan_exercise_id') === exerciseId);
            });

            if (allCompleted) {
                await User.increment('weeklyStreak', { by: 1, where: { user_id: userId } });
            } else {
                await User.update({ 'weeklyStreak': 0 }, { where: { user_id: userId } });
            }
        }

        console.log('Weekly streak update completed successfully.');
    } catch (error) {
        console.error('Error updating weekly streaks:', error);
    }
});
