import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default("http://127.0.0.1:5173"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required.")
    .default("postgresql://postgres:postgres@127.0.0.1:5432/project_dashboard"),
  DATABASE_SSL: z
    .union([z.literal("true"), z.literal("false")])
    .default("false")
    .transform((value) => value === "true"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters."),
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
  databaseUrl: parsedEnv.data.DATABASE_URL,
  databaseSsl: parsedEnv.data.DATABASE_SSL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
};
