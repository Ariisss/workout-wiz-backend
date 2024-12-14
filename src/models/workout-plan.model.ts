import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { GOAL_TYPES, INTENSITY_LEVELS } from "../types/workout-types";

const WorkoutPlan = sequelize.define(
    'WorkoutPlan',
    {
        plan_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        plan_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        duration_weeks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intensity: {
            type: DataTypes.ENUM(...Object.values(INTENSITY_LEVELS)),
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: "workout_plans",
        underscored: true,
        timestamps: true
    }
);

export default WorkoutPlan;