import mongoose from "mongoose";

import { env } from "../config/env.js";

mongoose.set("strictQuery", true);

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};
