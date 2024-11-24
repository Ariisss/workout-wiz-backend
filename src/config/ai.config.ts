import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import env from "./environment";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);


const workoutPlanSchema = {
    description: "Workout Plan",
    type: SchemaType.ARRAY,
    items: {
    type: SchemaType.OBJECT,
    properties: {
        "Plan Name": {
            type: SchemaType.STRING,
            description: "Name of the workout plan",
            nullable: false,
        },
        Goal: {
            type: SchemaType.STRING,
            description: "Goal of the workout plan",
            nullable: false,
        },
        Intensity: {
            type: SchemaType.STRING,
            description: "Intensity of the workout plan",
            nullable: false,
        },
        "Goal Type": {
            type: SchemaType.STRING,
            description: "Type of goal for the workout plan",
            nullable: false,
        },
      Exercise: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            Name: {
                type: SchemaType.STRING,
                description: "Name of the exercise",
                nullable: false,
            },
            Sets: {
                type: SchemaType.NUMBER,
                description: "Number of sets",
                nullable: false,
            },
            Reps: {
                type: SchemaType.NUMBER,
                description: "Number of reps",
                nullable: false,
            },
          },
          required: ["Name", "Sets", "Reps"]
        },
        nullable: false,
      },
    },
    required: ["Plan Name", "Goal", "Intensity", "Exercise", "Goal Type"],
  },
}


export default genAI;

