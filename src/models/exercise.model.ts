import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const Exercise = sequelize.define('Exercise', {
    exercise_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    default_duration: {
        type: DataTypes.INTEGER, // minutes
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: true
});

export default Exercise;
