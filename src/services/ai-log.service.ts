import AIGenerationLog from "../models/ai-log.model";

export const createAILog = async (user_id: number, prompt: string, response: string, status: string) => {
    return await AIGenerationLog.create({ user_id, prompt, response, status });
}

export const getAILogs = async (user_id: number) => {
    return await AIGenerationLog.findAll({ where: { user_id } });
}
