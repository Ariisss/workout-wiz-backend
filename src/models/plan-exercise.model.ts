import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const PlanExercise = sequelize.define('PlanExercise', {
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exercise_id: {
        type: DataTypes.INTEGER,
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
    underscored: true,
    timestamps: true
});

export default PlanExercise;