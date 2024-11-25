import AIGenerationLog from "../models/ai-log.model";

export const createAILog = async (data: any) => {
    return await AIGenerationLog.create(data);
}

export const getAILogs = async (user_id: number) => {
    return await AIGenerationLog.findAll({ where: { user_id } });
}

export const getAILogById = async (id: number) => {
    return await AIGenerationLog.findByPk(id);
}

export const updateAILog = async (id: number, data: any) => {
    return await AIGenerationLog.update(data, { where: { id } });
}

export const deleteAILog = async (id: number) => {
    return await AIGenerationLog.destroy({ where: { id } });
}
