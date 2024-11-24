import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const PlanExercise = sequelize.define('PlanExercise', {
    plan_exercise_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exercise_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration_mins: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    workout_day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reps: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'plan_exercises',
    underscored: true,
    timestamps: true
});

export default PlanExercise;