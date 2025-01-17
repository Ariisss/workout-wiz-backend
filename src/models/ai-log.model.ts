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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'completed'
    }
}, {
    tableName: 'ai_generation_logs',
    underscored: true,
    timestamps: true
});

export default AIGenerationLog;