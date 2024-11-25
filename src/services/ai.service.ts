import genAI from '../config/ai.config';
import { WorkoutPreferenceType } from '../types/types';
import { AIGenerationLog } from '../models';
import { createAILog } from './ai-log.service';
import { createWorkoutPlan } from './workout-plan.service';

export async function generateWorkoutPlans(preferences: WorkoutPreferenceType) {
    const prompt = `Create a personalized workout plan with these requirements:
        - Focus: ${preferences.goal_type}
        - Experience Level: ${preferences.intensity}
        - Equipment: ${preferences.with_gym ? 'Full gym access' : 'Bodyweight exercises only'}
        - Schedule: ${preferences.workout_days.split('').map((day, index) => 
            day === '1' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] : ''
        ).filter(Boolean).join(', ')}

        Important guidelines:
        - Include exactly 7 exercises for each workout day
        - Each exercise should have sets, reps, and clear instructions
        - Focus on exercises that match the experience level
        - Ensure exercises align with the available equipment
        - Strictly use double quotes for all property names and values
        - No code blocks, no newlines, no extra spaces, no extra commas, no extra quotes
        - Only return the JSON array containing the plan, with the plan object having its own properties, then an array of exercises, each with their own properties
        
       Required JSON format:
        [
            {
                "Plan Name": "Create a descriptive name",
                "Description": "Detailed plan description",
                "Goal": "${preferences.goal_type}",
                "Duration_Weeks": Strictly integer,
                "Intensity": "${preferences.intensity}",
                "Workout_Days": "${preferences.workout_days}",
                "Exercises": [
                    {
                        "Exercise Name": "Name of exercise",
                        "Description": "Clear, concise instructions",
                        "Sets": Strictly integer,
                        "Reps": Strictly integer,
                        "Workout Day": "Monday",
                        "MET Value": Strictly float
                    }
                    // Repeat for exactly 7 exercises per workout day
                ]
            }
        ]
        
        Note: The response must be a valid JSON array containing exactly one plan object. Each active workout day must have exactly 7 exercises.`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                temperature: 1.5,
                maxOutputTokens: 10000,
                topK: 40,
                topP: 0.8,
                candidateCount: 1
            }
        });

        const result = await model.generateContent({
            contents: [{ 
                role: "user", 
                parts: [{ 
                    text: prompt 
                }]
            }]
        });

        const text = result.response.text();

        console.log("Raw text: ", text);
        
        // More robust JSON cleaning
        const jsonStart = text.indexOf('[');
        const jsonEnd = text.lastIndexOf(']') + 1;
        const jsonContent = text.slice(jsonStart, jsonEnd);
        
        const cleanedText = jsonContent
            .replace(/```json\n?|\n?```/g, '')  // Remove code blocks
            .replace(/(['"])?([a-zA-Z0-9_\s]+)(['"])?\s*:/g, '"$2":')  // Ensure property names are quoted
            .replace(/:\s*'([^']*)'(?=\s*[,}])/g, ':"$1"')  // Convert single quotes to double quotes
            .replace(/:\s*"([^"]*)"(?=\s*[,}])/g, ':"$1"')  // Normalize spacing around quotes
            .replace(/\n\s*/g, ' ')  // Remove newlines
            .replace(/,\s*([\]}])/g, '$1')  // Remove trailing commas
            .trim();

        const parsedResponse = JSON.parse(cleanedText);

        if (!Array.isArray(parsedResponse)) {
            throw new Error('Response is not an array');
        }

        await createAILog(preferences.user_id, prompt, cleanedText, 'completed');
        await createWorkoutPlan(parsedResponse[0]);

        

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