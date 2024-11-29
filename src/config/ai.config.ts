import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import env from "./environment";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const workoutPlanSchema = {
    description: "Workout Plan",
    type: SchemaType.OBJECT,
    properties: {
        "Plan Name": {
            type: SchemaType.STRING,
            description: "Name of the workout plan",
            nullable: false,
            },
            Description: {
                type: SchemaType.STRING,
                description: "Description of the workout plan",
                nullable: false,
            },
            Goal: {
                type: SchemaType.STRING,
                description: "Goal of the workout plan",
                nullable: false,
            },
            Duration_Weeks: {
                type: SchemaType.NUMBER,
                description: "Duration of the workout plan in weeks",
                nullable: false,
            },
            Workout_Days: {
                type: SchemaType.STRING,
                description: "Days of the week to perform the workout",
                nullable: false,
            },
            Intensity: {
                type: SchemaType.STRING,
                description: "Intensity of the workout plan",
                nullable: false,
            },
            Exercises: {
                type: SchemaType.ARRAY,
                description: "List of exercises in the workout plan",
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        "Exercise Name": {
                            type: SchemaType.STRING,
                            description: "Name of the exercise",
                            nullable: false,
                        },
                        Description: {
                            type: SchemaType.STRING,
                            description: "Description of how to perform the exercise",
                            nullable: false,
                        },
                        Sets: {
                            type: SchemaType.INTEGER,
                            description: "Number of sets",
                            nullable: false,
                        },
                        Reps: {
                            type: SchemaType.INTEGER,
                            description: "Number of repetitions per set",
                            nullable: false,
                        },
                        "Workout Day": {
                            type: SchemaType.STRING,
                            description: "Day of the week to perform the workout",
                            nullable: false,
                        },
                        "met_value": {
                            type: SchemaType.NUMBER,
                            description: "Met value of the exercise",
                            nullable: false,
                        }
                    }
                }, 
            }
    }
}


export default genAI;

