import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const AIGenerationLog = sequelize.define('AIGenerationLog', {
    ai_log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prompt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.JSON,
        allowNull: false
    },
    generation_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'completed'
    }
}, {
    underscored: true,
    timestamps: true
});

export default AIGenerationLog;