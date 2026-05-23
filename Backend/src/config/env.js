import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default("http://127.0.0.1:5173"),
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required."),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters."),
  JWT_EXPIRES_IN: z.string().min(2).default("7d"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration.", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Environment validation failed.");
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  clientUrl: parsedEnv.data.CLIENT_URL,
  mongoUri: parsedEnv.data.MONGODB_URI,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  jwtExpiresIn: parsedEnv.data.JWT_EXPIRES_IN,
};
