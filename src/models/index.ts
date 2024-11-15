import User from './user.model';
import Preferences from './workout-preference.model';
import AIGenerationLog from './ai-log.model';
import Exercise from './exercise.model';
import ExerciseLog from './exercise-log.model';
import WorkoutPlan from './workout-plan.model';
import PlanExercise from './plan-exercise.model';

function setupAssociations(): void {

    // users n preferences
    User.hasOne(Preferences, {
        foreignKey: 'user_id',
        as: 'workoutPreference'
    });
    Preferences.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // users n workout plans
    User.hasMany(WorkoutPlan, {
        foreignKey: 'user_id',
        as: 'workoutPlans'
    });
    WorkoutPlan.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // users n ai logs
    User.hasMany(AIGenerationLog, {
        foreignKey: 'user_id',
        as: 'aiLogs'
    });
    AIGenerationLog.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // workout plans n plan exercises
    WorkoutPlan.hasMany(PlanExercise, {
        foreignKey: 'plan_id',
        as: 'planExercises'
    });
    PlanExercise.belongsTo(WorkoutPlan, {
        foreignKey: 'plan_id',
        as: 'workoutPlan'
    });

    // exercises n plan exercises
    Exercise.hasMany(PlanExercise, {
        foreignKey: 'exercise_id',
        as: 'planExercises'
    });
    PlanExercise.belongsTo(Exercise, {
        foreignKey: 'exercise_id',
        as: 'exercise'
    });

    // users n exercise logs
    User.hasMany(ExerciseLog, {
        foreignKey: 'user_id',
        as: 'exerciseLogs'
    });
    ExerciseLog.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    // exercises n exercise logs
    Exercise.hasMany(ExerciseLog, {
        foreignKey: 'exercise_id',
        as: 'exerciseLogs'
    });
    ExerciseLog.belongsTo(Exercise, {
        foreignKey: 'exercise_id',
        as: 'exercise'
    });
}

export {
    User,
    Preferences,
    WorkoutPlan,
    Exercise,
    ExerciseLog,
    PlanExercise,
    AIGenerationLog,
    setupAssociations
};