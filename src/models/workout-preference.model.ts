import { DataTypes } from "sequelize";
import sequelize from "../config/database";

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
        type: DataTypes.ENUM('Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'Balance'),
        allowNull: false
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
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: true
});

export default Preferences;