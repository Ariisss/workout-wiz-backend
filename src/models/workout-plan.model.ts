import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { GOAL_TYPES } from "../types/workout-types";
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
            type: DataTypes.ENUM(...Object.values(GOAL_TYPES)),
            allowNull: false
        },
        duration_weeks: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intensity: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: "workout_plans",
        underscored: true,
        timestamps: true
    }
);

export default WorkoutPlan;