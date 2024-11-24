import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import env from "./environment";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export default genAI;

