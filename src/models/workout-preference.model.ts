import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { GOAL_TYPES, INTENSITY_LEVELS } from "../types/workout-types";

const Preferences = sequelize.define('Preferences', {
    preference_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    goal_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isValidGoalType(value: string) {
                const goals = value.split(',');
                const validGoals = Object.values(GOAL_TYPES) as string[];
                if (!goals.every(goal => validGoals.includes(goal))) {
                    throw new Error('Invalid goal type');
                }
            }
        }
    },
    with_gym: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    workout_days: {
        type: DataTypes.STRING,
        allowNull: false
    },
    intensity: {
        type: DataTypes.ENUM(...Object.values(INTENSITY_LEVELS)),
        allowNull: false
    }
}, {
    tableName: "workout_preferences",
    underscored: true,
    timestamps: true
});

export default Preferences;