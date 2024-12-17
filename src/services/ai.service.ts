import genAI from '../config/ai.config';
import { WorkoutPreferenceType, PlanExerciseResponseType } from '../types/types';
import { AIGenerationLog, WorkoutPlan } from '../models';
import { createAILog } from './ai-log.service';
import { createPlan } from './workout-plan.service';
import { createPlanExerciseBulk } from './exercises.service';
import { GoalType } from '../types/workout-types';

export async function generateWorkoutPlans(preferences: WorkoutPreferenceType) {
    const prompt = `Create a unique and personalized workout plan with these requirements:
        - Focus: ${preferences.goal_type}
        - Experience Level: ${preferences.intensity}
        - Equipment: ${preferences.with_gym ? 'Full gym access' : 'Bodyweight exercises only'}
        - Schedule: ${preferences.workout_days.split('').map((day, index) => 
            day === '1' ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index] : ''
        ).filter(Boolean).join(', ')}

        Important guidelines:
        - Include exactly 5 exercises for each workout day
        - Strictly provide workouts for the days specified in the schedule
        - Each exercise should have sets, reps, and clear instructions
        - Focus on exercises that match the experience level
        - Do not use AMRAP, EMOM, or any other acronyms, just numbers for reps, sets, duration_mins and met value
        - Ensure exercises align with the available equipment
        - Strictly use double quotes for all property names and values
        - No code blocks, no newlines, no extra spaces, no extra commas, no extra quotes
        - Only return the JSON containing the plan, with the plan object having its own properties, then an array of exercises, each with their own properties
        
       Required JSON format:
        [
            {
                "Plan Name": "Unique name based on goals, make it 1 string only. Spaces are okay but no colons or other symbols. make it unique and creative please, it will be used as the plan name",
                "Description": "Detailed CUSTOM description",
                "Goal": "${preferences.goal_type}",
                "Duration_Weeks": Strictly integer,
                "Intensity": "${preferences.intensity}",
                "Workout_Days": "${preferences.workout_days}",
                "Exercises": [
                    {
                        "exercise_name": "Name of exercise",
                        "description": "Clear, elaborate instructions. Provide a detailed instruction as to how to perform the exercise",
                        "sets": Strictly integer, no other characters,
                        "reps": Strictly integer, no other characters,
                        "duration_mins": Strictly float, no other characters,
                        "workout_day": "Monday",
                        "met_value": Strictly float, no other characters
                    }
                    // Repeat for exactly 5 exercises per workout day
                ]
            }
        ]
        
        Note: The response must be a valid JSON containing exactly one plan object. Each active workout day must have exactly 5 exercises.`;

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 20000,
                    topK: 40,
                    topP: 0.8,
                    // candidateCount: 1
                }
            });
    
            const result = await model.generateContent({
                contents: [{ 
                    role: "user", 
                    parts: [{ text: prompt }]
                }]
            });
    
            const text = result.response.text();
            console.log("Raw text: ", text);
    
            // More robust JSON cleaning
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error('Invalid JSON structure');
            }
    
            const jsonContent = text.slice(jsonStart, jsonEnd);
            
            const cleanedText = jsonContent
                .replace(/```json\n?|\n?```/g, '')  // Remove code blocks
                .replace(/(['"])?([a-zA-Z0-9_\s]+)(['"])?\s*:/g, '"$2":')  // Ensure property names are quoted
                .replace(/:\s*'([^']*)'(?=\s*[,}])/g, ':"$1"')  // Convert single quotes to double quotes
                .replace(/:\s*"([^"]*)"(?=\s*[,}])/g, ':"$1"')  // Normalize spacing around quotes
                .replace(/\n\s*/g, ' ')  // Remove newlines
                .replace(/,\s*([\]}])/g, '$1')  // Remove trailing commas
                .replace(/[\u2018\u2019]/g, "'")  // Replace smart single quotes
                .replace(/[\u201C\u201D]/g, '"')  // Replace smart double quotes
                .trim();
    
            console.log("Cleaned text: ", cleanedText);
    
            const parsedResponse = JSON.parse(cleanedText);
            console.log("Parsed response: ", JSON.stringify(parsedResponse, null, 2));
    
            await createAILog(preferences.user_id, prompt, cleanedText, 'completed');
    
            const existingWorkoutPlan = await WorkoutPlan.findOne({
                where: {
                  user_id: preferences.user_id,
                  is_active: true
                }
            });
            
            const workoutPlan = {
                user_id: preferences.user_id,
                plan_name: parsedResponse['Plan Name'],
                description: parsedResponse.Description,
                goal: parsedResponse.Goal,
                duration_weeks: parsedResponse.Duration_Weeks,
                workout_days: parsedResponse.Workout_Days,
                intensity: parsedResponse.Intensity,
                is_active: !existingWorkoutPlan
            };
    
            const createdWorkoutPlan = await createPlan(workoutPlan);
            const retrievedWorkoutPlan = createdWorkoutPlan.get();
    
            const planExercises = parsedResponse.Exercises;
    
            const exercisesToCreate = planExercises.map((exercise: PlanExerciseResponseType) => ({
                plan_id: retrievedWorkoutPlan.plan_id,
                exercise_name: exercise.exercise_name,
                description: exercise.description,
                sets: exercise.sets,
                reps: exercise.reps,
                duration_mins: exercise.duration_mins,
                workout_day: exercise.workout_day,
                met_value: exercise.met_value
            }));
    
            await createPlanExerciseBulk(exercisesToCreate);
    
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

function validateResponse(text: string): boolean {
    return !text.includes('prohibited content');
}