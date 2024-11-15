import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const ExerciseLog = sequelize.define('ExerciseLog', {
    log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    duration_mins: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    calories_burned: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'exercise_logs',
    underscored: true,
    timestamps: true
});

export default ExerciseLog;
