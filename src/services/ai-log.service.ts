import AIGenerationLog from "../models/ai-log.model";

export const createAILog = async (user_id: number, prompt: string, response: string, status: string) => {
    return await AIGenerationLog.create({ user_id, prompt, response, status });
}

export const getAILogs = async (user_id: number) => {
    return await AIGenerationLog.findAll({ where: { user_id } });
}

export const updateAILog = async (id: number, user_id: number, prompt: string, response: string, status: string) => {
    return await AIGenerationLog.update({ user_id, prompt, response, status }, { where: { ai_log_id: id } });
}

export const deleteAILog = async (id: number) => {
    return await AIGenerationLog.destroy({ where: { ai_log_id: id } });
}