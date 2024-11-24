import genAI from '../config/ai.config';
import { WorkoutPreferenceType } from '../types/types';
import { AIGenerationLog } from '../models';

export async function generateWorkoutPlans(preferences: WorkoutPreferenceType) {
    const prompt = `Generate 3 different workout plans based on these preferences:
        - Goal: ${preferences.goal_type}
        - Intensity Level: ${preferences.intensity}
        - Has Gym Access: ${preferences.with_gym ? 'Yes' : 'No'}
        - Workout Days: ${preferences.workout_days}

        Return exactly 3 workout plans in this JSON format:
        [
            {
                "Plan Name": "Plan 1",
                "Description": "Description of the plan",
                "Goal": "${preferences.goal_type}",
                "Duration_Weeks": 4,
                "Intensity": "${preferences.intensity}",
                "Exercises": [
                    {
                        "Exercise Name": "Exercise 1",
                        "Description": "How to perform the exercise",
                        "Sets": 3,
                        "Reps": 12,
                        "Workout Day": "Monday"
                    }
                ]
            }
        ]`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 5000
            }
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }]}]
        });

        const text = result.response.text();

        // gi remove ni ang markdown code block para ma parse ang json
        const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim(); // i dont even know this regex, chatgpted
        const parsedResponse = JSON.parse(cleanedText);

        if (!Array.isArray(parsedResponse)) {
            throw new Error('Response is not an array');
        }

        await AIGenerationLog.create({
            user_id: preferences.user_id,
            prompt,
            response: cleanedText,
            status: 'completed'
        });

        return parsedResponse;
    } catch (error) {
        await AIGenerationLog.create({
            user_id: preferences.user_id,
            prompt,
            response: error instanceof Error ? error.message : 'Unknown error',
            status: 'failed'
        });
        throw error;
    }
}