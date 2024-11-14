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
        type: DataTypes.STRING,
        allowNull: false
    },
    with_gym: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    workout_days: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    intensity: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: true
});

export default Preferences;