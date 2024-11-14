import dotenv from 'dotenv';

dotenv.config();

interface Environment {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    GEMINI_API_KEY: string;
}

const env: Environment = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}


function validateEnv(): void {
    const require = ['PORT', 'DATABASE_URL', 'JWT_SECRET', 'GEMINI_API_KEY']

    for(const key of require){
        if(!process.env[key]){
            throw new Error(`Missing environment variable: ${key}`)
        }
    }
}

validateEnv()

export default env
