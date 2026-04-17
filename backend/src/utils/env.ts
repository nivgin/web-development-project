import { StringValue } from 'ms';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const requiredEnvVar = (varname: string) => {
    const value = process.env[varname];
    if (!value) {
        throw new Error(`Missing Env Var: ${varname}`)
    }

    return value;
}

const env = {
    PORT: process.env.PORT || 80,
    HTTPS_PORT: process.env.HTTPS_PORT || 443,
    BASE_DOMAIN: "http://localhost",
    DATABASE_URI: process.env.DATABASE_URI || 'mongodb://localhost:27017',
    ACCESS_TOKEN_SECRET: requiredEnvVar("ACCESS_TOKEN_SECRET"),
    REFRESH_TOKEN_SECRET: requiredEnvVar("REFRESH_TOKEN_SECRET"),
    OPENAI_API_KEY: requiredEnvVar("OPENAI_API_KEY"),
    JWT_TOKEN_EXPIRATION: requiredEnvVar("JWT_TOKEN_EXPIRATION") as StringValue,
    GOOGLE_CLIENT_ID: requiredEnvVar("GOOGLE_CLIENT_ID"),
    NODE_ENV: process.env.NODE_ENV || 'dev'
}

export default env;